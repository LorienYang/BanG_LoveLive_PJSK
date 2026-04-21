import { spawnSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')
const cacheRoot = join(rootDir, '.cache', 'map-sources')
const skipPull =
  process.argv.includes('--skip-pull') || process.env.MAP_SYNC_SKIP_PULL === '1'

const mirrorDeclaration = [
  '        <br>',
  '        <p class="card-body">',
  '          你当前访问的为镜像站，此镜像由 <a href="https://github.com/LorienYang">Lorien Yang </a>提供。皆在为大家提供更好的可访问性。',
  '        </p>',
  '        <br>',
].join('\n')

const icpFooter = [
  '    <footer id="siteFooter">',
  '      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank" rel="noopener noreferrer">浙ICP备2025171659号-2</a>',
  '    </footer>',
].join('\n')

const sources = [
  {
    key: 'Bang_Dream',
    repoUrl: 'https://github.com/LorienYang/china-bandori-maps.git',
    targetDir: join(rootDir, 'public', 'maps', 'Bang_Dream'),
  },
  {
    key: 'LoveLive',
    repoUrl: 'https://github.com/HELPMEEADICE/china-lovelive-maps.git',
    targetDir: join(rootDir, 'public', 'maps', 'LoveLive'),
  },
  {
    key: 'PJSK',
    repoUrl: 'https://github.com/HELPMEEADICE/china-pjsk-maps.git',
    targetDir: join(rootDir, 'public', 'maps', 'PJSK'),
  },
]

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? rootDir,
    stdio: 'pipe',
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join('\n').trim()
    throw new Error(detail || `${command} ${args.join(' ')} failed`)
  }

  return result.stdout.trim()
}

function ensureDirectory(path) {
  mkdirSync(path, { recursive: true })
}

function clearDirectory(path) {
  ensureDirectory(path)

  for (const entry of readdirSync(path)) {
    rmSync(join(path, entry), { recursive: true, force: true })
  }
}

function copyDirectory(source, destination) {
  ensureDirectory(destination)

  for (const entry of readdirSync(source)) {
    if (entry === '.git') {
      continue
    }

    const sourcePath = join(source, entry)
    const destinationPath = join(destination, entry)
    const stats = statSync(sourcePath)

    if (stats.isDirectory()) {
      copyDirectory(sourcePath, destinationPath)
      continue
    }

    cpSync(sourcePath, destinationPath)
  }
}

function hasLocalMirror(source) {
  return existsSync(join(source.targetDir, 'index.html'))
}

function syncSource(source) {
  const cacheDir = join(cacheRoot, source.key)

  if (skipPull) {
    console.log(`[sync:maps] skip pull: ${source.key}`)
    if (!hasLocalMirror(source)) {
      throw new Error(
        `[sync:maps] missing local mirror files for ${source.key}; run without --skip-pull first`,
      )
    }
    return
  }

  try {
    ensureDirectory(cacheRoot)

    if (existsSync(join(cacheDir, '.git'))) {
      console.log(`[sync:maps] update ${source.key}`)
      run('git', ['-C', cacheDir, 'fetch', 'origin', '--prune'])
      run('git', ['-C', cacheDir, 'pull', '--ff-only'])
    } else {
      console.log(`[sync:maps] clone ${source.key}`)
      run('git', ['clone', '--depth', '1', source.repoUrl, cacheDir])
    }

    console.log(`[sync:maps] copy ${source.key} -> ${source.targetDir}`)
    clearDirectory(source.targetDir)
    copyDirectory(cacheDir, source.targetDir)
  } catch (error) {
    if (hasLocalMirror(source)) {
      const message = error instanceof Error ? error.message : String(error)
      console.warn(`[sync:maps] warn ${source.key}: ${message}`)
      console.warn(`[sync:maps] use existing local files for ${source.key}`)
      return
    }

    throw error
  }
}

function applyOverrides(source) {
  const htmlPath = join(source.targetDir, 'index.html')
  const html = readFileSync(htmlPath, 'utf8')

  let nextHtml = html

  if (!nextHtml.includes('你当前访问的为镜像站')) {
    nextHtml = nextHtml.replace(
      /(<img[\s\S]*?\/>\s*<p class="card-body">[\s\S]*?<\/p>)/,
      `$1\n${mirrorDeclaration}`,
    )
  }

  if (!nextHtml.includes('浙ICP备2025171659号-2')) {
    nextHtml = nextHtml.replace(
      /^[ \t]*<footer id="siteFooter">[\s\S]*?<\/footer>/m,
      icpFooter,
    )
  }

  if (nextHtml !== html) {
    writeFileSync(htmlPath, nextHtml, 'utf8')
  }
}

function main() {
  for (const source of sources) {
    syncSource(source)
    applyOverrides(source)
  }

  console.log('[sync:maps] done')
}

main()
