import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  IconDeviceFloppy, 
  IconX, 
  IconFile,
  IconBrandTypescript,
  IconBrandJavascript,
  IconBrandReact,
  IconFileCode,
  IconFileText
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import CodeEditor from '@uiw/react-textarea-code-editor'

interface IDECodeEditorProps {
  activeFile: string | null
  content: string
  onContentChange: (content: string) => void
}

interface Tab {
  filePath: string
  fileName: string
  content: string
  isDirty: boolean
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

function getLanguage(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase()
  
  switch (ext) {
    case 'tsx':
    case 'jsx':
      return 'jsx'
    case 'ts':
      return 'typescript'
    case 'js':
      return 'javascript'
    case 'json':
      return 'json'
    case 'css':
      return 'css'
    case 'html':
      return 'html'
    case 'md':
      return 'markdown'
    default:
      return 'text'
  }
}

export function IDECodeEditor({ activeFile, content, onContentChange }: IDECodeEditorProps) {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [editorContent, setEditorContent] = useState('')

  // Update tabs when a new file is selected
  useEffect(() => {
    if (activeFile && !tabs.find(tab => tab.filePath === activeFile)) {
      const fileName = activeFile.split('/').pop() || activeFile
      const newTab: Tab = {
        filePath: activeFile,
        fileName,
        content,
        isDirty: false
      }
      setTabs(prev => [...prev, newTab])
      setActiveTabIndex(tabs.length)
      setEditorContent(content)
    } else if (activeFile) {
      const tabIndex = tabs.findIndex(tab => tab.filePath === activeFile)
      if (tabIndex !== -1) {
        setActiveTabIndex(tabIndex)
        setEditorContent(tabs[tabIndex].content)
      }
    }
  }, [activeFile, content, tabs])

  const handleContentChange = (value: string) => {
    setEditorContent(value)
    onContentChange(value)
    
    // Mark tab as dirty
    if (tabs[activeTabIndex]) {
      setTabs(prev => prev.map((tab, index) => 
        index === activeTabIndex 
          ? { ...tab, content: value, isDirty: tab.content !== value }
          : tab
      ))
    }
  }

  const handleTabClose = (tabIndex: number) => {
    const newTabs = tabs.filter((_, index) => index !== tabIndex)
    setTabs(newTabs)
    
    if (activeTabIndex >= newTabs.length) {
      setActiveTabIndex(Math.max(0, newTabs.length - 1))
    } else if (activeTabIndex > tabIndex) {
      setActiveTabIndex(activeTabIndex - 1)
    }
    
    if (newTabs.length > 0) {
      const newActiveTab = newTabs[Math.min(activeTabIndex, newTabs.length - 1)]
      setEditorContent(newActiveTab.content)
    } else {
      setEditorContent('')
    }
  }

  const handleTabClick = (tabIndex: number) => {
    setActiveTabIndex(tabIndex)
    setEditorContent(tabs[tabIndex].content)
  }

  const handleSave = () => {
    if (tabs[activeTabIndex]) {
      setTabs(prev => prev.map((tab, index) => 
        index === activeTabIndex 
          ? { ...tab, isDirty: false }
          : tab
      ))
      // In a real app, this would save to the file system
      console.log('Saving file:', tabs[activeTabIndex].filePath)
    }
  }

  if (tabs.length === 0) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <IconFile size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No file open</p>
            <p className="text-sm">Select a file from the explorer to start editing</p>
          </div>
        </div>
      </div>
    )
  }

  const activeTab = tabs[activeTabIndex]
  const language = activeTab ? getLanguage(activeTab.fileName) : 'text'

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Tab Bar */}
      <div className="flex items-center bg-muted/30 border-b border-border overflow-x-auto">
        {tabs.map((tab, index) => {
          const Icon = getFileIcon(tab.fileName)
          return (
            <div
              key={tab.filePath}
              className={cn(
                'flex items-center gap-2 px-3 py-2 border-r border-border cursor-pointer text-sm hover:bg-accent/50 min-w-0',
                index === activeTabIndex && 'bg-background'
              )}
              onClick={() => handleTabClick(index)}
            >
              <Icon size={14} />
              <span className="truncate max-w-32">{tab.fileName}</span>
              {tab.isDirty && (
                <div className="w-2 h-2 rounded-full bg-orange-500" />
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-destructive/20"
                onClick={(e) => {
                  e.stopPropagation()
                  handleTabClose(index)
                }}
              >
                <IconX size={10} />
              </Button>
            </div>
          )
        })}
      </div>

      {/* Editor Actions */}
      <div className="flex items-center justify-between px-3 py-1 bg-muted/20 border-b border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{activeTab?.fileName}</span>
          {activeTab?.isDirty && <span className="text-orange-500">● Modified</span>}
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2"
            onClick={handleSave}
            disabled={!activeTab?.isDirty}
          >
            <IconDeviceFloppy size={12} className="mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 overflow-hidden">
        <CodeEditor
          value={editorContent}
          language={language}
          onChange={(e) => handleContentChange(e.target.value)}
          padding={16}
          data-color-mode="dark"
          style={{
            fontSize: 14,
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            height: '100%',
            overflow: 'auto',
          }}
        />
      </div>
    </div>
  )
}