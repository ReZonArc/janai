import { useState } from 'react'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { IDEChat } from './ide/IDEChat'
import { IDEFileExplorer } from './ide/IDEFileExplorer'
import { IDECodeEditor } from './ide/IDECodeEditor'
import { IDETerminal } from './ide/IDETerminal'
import { IDESidebar } from './ide/IDESidebar'

export function IDELayout() {
  const [activeFile, setActiveFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const [sidebarTab, setSidebarTab] = useState<'files' | 'chat'>('files')

  const handleFileSelect = (filePath: string, content: string) => {
    setActiveFile(filePath)
    setFileContent(content)
  }

  const handleFileContentChange = (content: string) => {
    setFileContent(content)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* IDE Main Layout */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="w-12 bg-sidebar border-r border-border flex flex-col">
          <IDESidebar activeTab={sidebarTab} onTabChange={setSidebarTab} />
        </div>

        {/* Main IDE Area */}
        <div className="flex-1">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Left Panel - File Explorer or Chat */}
            <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
              <div className="h-full">
                {sidebarTab === 'files' ? (
                  <IDEFileExplorer onFileSelect={handleFileSelect} />
                ) : (
                  <IDEChat />
                )}
              </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Right Panel Group */}
            <ResizablePanel defaultSize={75} minSize={60}>
              <ResizablePanelGroup direction="vertical" className="h-full">
                {/* Top - Code Editor */}
                <ResizablePanel defaultSize={70} minSize={40}>
                  <IDECodeEditor
                    activeFile={activeFile}
                    content={fileContent}
                    onContentChange={handleFileContentChange}
                  />
                </ResizablePanel>

                <ResizableHandle />

                {/* Bottom - Terminal */}
                <ResizablePanel defaultSize={30} minSize={20} maxSize={60}>
                  <IDETerminal />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}