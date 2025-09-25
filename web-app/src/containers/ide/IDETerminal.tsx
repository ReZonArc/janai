import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconTerminal, IconX, IconTrash } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface TerminalOutput {
  id: string
  type: 'command' | 'output' | 'error'
  content: string
  timestamp: Date
}

export function IDETerminal() {
  const [output, setOutput] = useState<TerminalOutput[]>([
    {
      id: '1',
      type: 'output',
      content: 'Welcome to the IDE Terminal! Type "help" for available commands.',
      timestamp: new Date()
    }
  ])
  const [currentCommand, setCurrentCommand] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isMinimized, setIsMinimized] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock command execution
  const executeCommand = (command: string): TerminalOutput[] => {
    const cmd = command.trim().toLowerCase()
    const results: TerminalOutput[] = []

    switch (cmd) {
      case 'help':
        results.push({
          id: Date.now().toString(),
          type: 'output',
          content: `Available commands:
  help     - Show this help message
  ls       - List files and directories
  pwd      - Print working directory
  clear    - Clear terminal
  echo     - Echo text
  npm      - Mock npm commands
  git      - Mock git commands
  date     - Show current date`,
          timestamp: new Date()
        })
        break
      
      case 'ls':
        results.push({
          id: Date.now().toString(),
          type: 'output',
          content: 'src/  public/  package.json  README.md  node_modules/',
          timestamp: new Date()
        })
        break
      
      case 'pwd':
        results.push({
          id: Date.now().toString(),
          type: 'output',
          content: '/home/user/ide-project',
          timestamp: new Date()
        })
        break
      
      case 'date':
        results.push({
          id: Date.now().toString(),
          type: 'output',
          content: new Date().toString(),
          timestamp: new Date()
        })
        break
      
      case 'clear':
        // Clear will be handled separately
        return []
      
      default:
        if (cmd.startsWith('echo ')) {
          results.push({
            id: Date.now().toString(),
            type: 'output',
            content: command.slice(5),
            timestamp: new Date()
          })
        } else if (cmd.startsWith('npm ')) {
          results.push({
            id: Date.now().toString(),
            type: 'output',
            content: `npm ${cmd.slice(4)}\nMock npm output - command executed successfully`,
            timestamp: new Date()
          })
        } else if (cmd.startsWith('git ')) {
          results.push({
            id: Date.now().toString(),
            type: 'output',
            content: `git ${cmd.slice(4)}\nMock git output - command executed successfully`,
            timestamp: new Date()
          })
        } else if (cmd === '') {
          // Empty command, do nothing
        } else {
          results.push({
            id: Date.now().toString(),
            type: 'error',
            content: `Command not found: ${command}. Type "help" for available commands.`,
            timestamp: new Date()
          })
        }
    }

    return results
  }

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentCommand.trim()) return

    // Add command to output
    const commandOutput: TerminalOutput = {
      id: Date.now().toString(),
      type: 'command',
      content: `$ ${currentCommand}`,
      timestamp: new Date()
    }

    // Execute command
    if (currentCommand.trim().toLowerCase() === 'clear') {
      setOutput([])
    } else {
      const results = executeCommand(currentCommand)
      setOutput(prev => [...prev, commandOutput, ...results])
    }

    // Add to history
    setCommandHistory(prev => [...prev, currentCommand])
    setHistoryIndex(-1)
    setCurrentCommand('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentCommand('')
        } else {
          setHistoryIndex(newIndex)
          setCurrentCommand(commandHistory[newIndex])
        }
      }
    }
  }

  const clearTerminal = () => {
    setOutput([])
  }

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  // Focus input when terminal is clicked
  const handleTerminalClick = () => {
    if (inputRef.current && !isMinimized) {
      inputRef.current.focus()
    }
  }

  if (isMinimized) {
    return (
      <div className="h-full flex flex-col bg-black text-green-400 border-t border-border">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <IconTerminal size={16} />
            <span className="text-sm font-medium">Terminal</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            onClick={() => setIsMinimized(false)}
          >
            <IconTerminal size={12} />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
          Terminal minimized - click to expand
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-black text-green-400 border-t border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <IconTerminal size={16} />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            onClick={clearTerminal}
          >
            <IconTrash size={12} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            onClick={() => setIsMinimized(true)}
          >
            <IconX size={12} />
          </Button>
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={outputRef}
        className="flex-1 overflow-auto p-3 font-mono text-sm cursor-text"
        onClick={handleTerminalClick}
      >
        {output.map((item) => (
          <div
            key={item.id}
            className={cn(
              'mb-1',
              item.type === 'command' && 'text-white',
              item.type === 'output' && 'text-green-400',
              item.type === 'error' && 'text-red-400'
            )}
          >
            <pre className="whitespace-pre-wrap font-mono">{item.content}</pre>
          </div>
        ))}
      </div>

      {/* Command Input */}
      <form onSubmit={handleCommandSubmit} className="flex items-center px-3 py-2 border-t border-gray-700">
        <span className="text-green-400 mr-2 font-mono">$</span>
        <Input
          ref={inputRef}
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
          className="flex-1 bg-transparent border-none text-green-400 font-mono focus:ring-0 focus:outline-none p-0"
          autoComplete="off"
        />
      </form>
    </div>
  )
}