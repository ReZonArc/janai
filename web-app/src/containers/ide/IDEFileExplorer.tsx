import { useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  IconFolder, 
  IconFolderOpen,
  IconFile,
  IconFileText,
  IconBrandTypescript,
  IconBrandJavascript,
  IconBrandReact,
  IconFileCode,
  IconPlus,
  IconRefresh
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileItem[]
  expanded?: boolean
}

interface IDEFileExplorerProps {
  onFileSelect: (filePath: string, content: string) => void
}

// Mock file system data - in a real implementation, this would come from an API
const mockFileSystem: FileItem[] = [
  {
    name: 'src',
    type: 'folder',
    path: 'src',
    expanded: true,
    children: [
      {
        name: 'components',
        type: 'folder',
        path: 'src/components',
        children: [
          { name: 'App.tsx', type: 'file', path: 'src/components/App.tsx' },
          { name: 'Button.tsx', type: 'file', path: 'src/components/Button.tsx' },
        ]
      },
      {
        name: 'hooks',
        type: 'folder',
        path: 'src/hooks',
        children: [
          { name: 'useAuth.ts', type: 'file', path: 'src/hooks/useAuth.ts' },
        ]
      },
      { name: 'main.tsx', type: 'file', path: 'src/main.tsx' },
      { name: 'index.css', type: 'file', path: 'src/index.css' },
    ]
  },
  {
    name: 'public',
    type: 'folder',
    path: 'public',
    children: [
      { name: 'index.html', type: 'file', path: 'public/index.html' },
    ]
  },
  { name: 'package.json', type: 'file', path: 'package.json' },
  { name: 'README.md', type: 'file', path: 'README.md' },
]

// Mock file contents
const mockFileContents: Record<string, string> = {
  'src/components/App.tsx': `import React from 'react'
import { Button } from './Button'

function App() {
  return (
    <div className="App">
      <h1>Hello World</h1>
      <Button>Click me</Button>
    </div>
  )
}

export default App`,
  'src/components/Button.tsx': `import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button 
      className="px-4 py-2 bg-blue-500 text-white rounded"
      onClick={onClick}
    >
      {children}
    </button>
  )
}`,
  'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
  'package.json': `{
  "name": "ide-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`,
  'README.md': `# IDE App

This is a sample project created in the IDE.

## Getting Started

1. Install dependencies: \`npm install\`
2. Start dev server: \`npm run dev\`
3. Build for production: \`npm run build\`
`
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase()
  
  switch (ext) {
    case 'tsx':
    case 'jsx':
      return IconBrandReact
    case 'ts':
      return IconBrandTypescript
    case 'js':
      return IconBrandJavascript
    case 'json':
      return IconFileCode
    case 'md':
      return IconFileText
    default:
      return IconFile
  }
}

function FileTreeItem({ 
  item, 
  level = 0, 
  onToggle, 
  onFileSelect 
}: { 
  item: FileItem
  level?: number
  onToggle: (path: string) => void
  onFileSelect: (filePath: string, content: string) => void
}) {
  const Icon = item.type === 'folder' 
    ? (item.expanded ? IconFolderOpen : IconFolder)
    : getFileIcon(item.name)

  const handleClick = () => {
    if (item.type === 'folder') {
      onToggle(item.path)
    } else {
      const content = mockFileContents[item.path] || `// Content of ${item.name}`
      onFileSelect(item.path, content)
    }
  }

  return (
    <div>
      <div
        className={cn(
          'flex items-center py-1 px-2 hover:bg-accent/50 cursor-pointer text-sm',
          `pl-${2 + level * 4}`
        )}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={handleClick}
      >
        <Icon size={16} className="mr-2" />
        <span className="flex-1 truncate">{item.name}</span>
      </div>
      
      {item.type === 'folder' && item.expanded && item.children && (
        <div>
          {item.children.map((child) => (
            <FileTreeItem
              key={child.path}
              item={child}
              level={level + 1}
              onToggle={onToggle}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function IDEFileExplorer({ onFileSelect }: IDEFileExplorerProps) {
  const [fileSystem, setFileSystem] = useState<FileItem[]>(mockFileSystem)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleFolder = (path: string) => {
    const updateItems = (items: FileItem[]): FileItem[] => {
      return items.map(item => {
        if (item.path === path) {
          return { ...item, expanded: !item.expanded }
        }
        if (item.children) {
          return { ...item, children: updateItems(item.children) }
        }
        return item
      })
    }
    
    setFileSystem(updateItems(fileSystem))
  }

  const filteredFileSystem = fileSystem // In real app, implement search filtering

  return (
    <div className="h-full flex flex-col bg-background border-r border-border">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Explorer</h3>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <IconPlus size={12} />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <IconRefresh size={12} />
            </Button>
          </div>
        </div>
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-7 text-xs"
        />
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-auto">
        {filteredFileSystem.map((item) => (
          <FileTreeItem
            key={item.path}
            item={item}
            onToggle={toggleFolder}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    </div>
  )
}