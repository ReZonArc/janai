import React, { useState } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'

export function NoiBrowser() {
  const [message, setMessage] = useState('')
  const [urls, setUrls] = useState(['https://chatgpt.com', 'https://claude.ai'])

  const handleSendBatch = () => {
    // Simulate sending to multiple AI chats
    urls.forEach(url => {
      console.log(`Sending to ${url}: ${message}`)
      // In a real implementation, this would open tabs or use APIs
    })
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Noi Browser - Batch AI Interaction</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">AI URLs</label>
        {urls.map((url, index) => (
          <Input
            key={index}
            value={url}
            onChange={(e) => {
              const newUrls = [...urls]
              newUrls[index] = e.target.value
              setUrls(newUrls)
            }}
            className="mb-2"
          />
        ))}
        <Button
          onClick={() => setUrls([...urls, ''])}
          variant="outline"
          className="mt-2"
        >
          Add URL
        </Button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Message</label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message to send to all AI chats"
          rows={4}
        />
      </div>
      <Button onClick={handleSendBatch}>Send Batch Message</Button>
    </div>
  )
}