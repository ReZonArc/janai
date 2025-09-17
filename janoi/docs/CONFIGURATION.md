# Configuration System Documentation

## Overview

Noi's configuration system provides a flexible and extensible way to manage application settings, AI service configurations, and user preferences. The system supports multiple configuration sources, validation, and real-time updates.

## Configuration Architecture

```mermaid
graph TB
    subgraph "Configuration Sources"
        Default[Default Configuration]
        User[User Configuration]
        Remote[Remote Sync]
        CLI[Command Line Args]
        Environment[Environment Variables]
    end
    
    subgraph "Configuration Manager"
        Loader[Config Loader]
        Merger[Config Merger]
        Validator[Schema Validator]
        Watcher[File Watcher]
        Cache[Config Cache]
    end
    
    subgraph "Configuration Files"
        Mode[noi.mode.json]
        Settings[settings.json]
        Extensions[extensions.json]
        Prompts[prompts.json]
        Theme[theme.json]
    end
    
    subgraph "Application Components"
        UI[User Interface]
        Browser[Browser Engine]
        Extensions_System[Extension System]
        Proxy[Proxy Manager]
    end
    
    Default --> Loader
    User --> Loader
    Remote --> Loader
    CLI --> Loader
    Environment --> Loader
    
    Loader --> Merger
    Merger --> Validator
    Validator --> Cache
    Cache --> Watcher
    
    Cache --> Mode
    Cache --> Settings
    Cache --> Extensions
    Cache --> Prompts
    Cache --> Theme
    
    Mode --> Browser
    Settings --> UI
    Extensions --> Extensions_System
    Settings --> Proxy
```

## Configuration Files

### 1. Mode Configuration (`noi.mode.json`)

Defines AI services and navigation structure:

```json
{
  "name": "Noi Modes",
  "version": "1.0.0",
  "sync": {
    "url": "https://raw.githubusercontent.com/lencx/Noi/main/configs/noi.mode.json",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "modes": [
    {
      "id": "chatgpt",
      "parent": "ai-chat",
      "text": "ChatGPT",
      "url": "https://chatgpt.com",
      "dir": false,
      "icon": "openai",
      "shortcut": "cmd+1"
    },
    {
      "id": "ai-chat",
      "text": "AI Chat Services",
      "dir": true,
      "children": ["chatgpt", "claude", "gemini"]
    }
  ]
}
```

### 2. Application Settings (`settings.json`)

User preferences and application configuration:

```json
{
  "appearance": {
    "theme": "system",
    "customTheme": {
      "primary": "#007acc",
      "secondary": "#f0f0f0"
    },
    "fontSize": 14,
    "fontFamily": "system"
  },
  "behavior": {
    "cacheMode": true,
    "cookieIsolation": true,
    "autoUpdate": true,
    "startupUrl": "noi://home"
  },
  "privacy": {
    "clearDataOnExit": false,
    "blockTrackers": true,
    "enableDNT": true
  },
  "shortcuts": {
    "newTab": "cmd+t",
    "closeTab": "cmd+w",
    "toggleSidebar": "cmd+b"
  }
}
```

### 3. Extension Configuration (`extensions.json`)

Extension settings and registry:

```json
{
  "registry": {
    "official": "https://noi.lencx.dev/extensions",
    "community": "https://github.com/noi-extensions"
  },
  "installed": [
    {
      "id": "@noi/ask",
      "version": "0.2.2",
      "enabled": true,
      "settings": {
        "autoSave": true,
        "batchSize": 5
      }
    }
  ],
  "permissions": {
    "storage": ["@noi/ask"],
    "tabs": ["@noi/reset"]
  }
}
```

## Configuration Schema

```mermaid
classDiagram
    class NoiConfig {
        +String version
        +ModeConfig modes
        +SettingsConfig settings
        +ExtensionConfig extensions
        +ProxyConfig proxy
        +validate() Boolean
        +merge(other) NoiConfig
    }
    
    class ModeConfig {
        +String name
        +String version
        +SyncConfig sync
        +Mode[] modes
        +validate() Boolean
    }
    
    class Mode {
        +String id
        +String parent
        +String text
        +String url
        +Boolean dir
        +String icon
        +String shortcut
        +Mode[] children
    }
    
    class SettingsConfig {
        +AppearanceConfig appearance
        +BehaviorConfig behavior
        +PrivacyConfig privacy
        +ShortcutConfig shortcuts
    }
    
    class AppearanceConfig {
        +String theme
        +Object customTheme
        +Number fontSize
        +String fontFamily
    }
    
    class BehaviorConfig {
        +Boolean cacheMode
        +Boolean cookieIsolation
        +Boolean autoUpdate
        +String startupUrl
    }
    
    NoiConfig --> ModeConfig
    NoiConfig --> SettingsConfig
    ModeConfig --> Mode
    SettingsConfig --> AppearanceConfig
    SettingsConfig --> BehaviorConfig
```

## Configuration Loading Process

```mermaid
sequenceDiagram
    participant App as Application
    participant Loader as Config Loader
    participant FS as File System
    participant Remote as Remote Source
    participant Validator as Schema Validator
    participant Cache as Config Cache
    
    App->>Loader: Initialize Config
    Loader->>FS: Load Default Config
    FS->>Loader: Default Config Data
    Loader->>FS: Load User Config
    FS->>Loader: User Config Data
    Loader->>Remote: Fetch Remote Config
    Remote->>Loader: Remote Config Data
    Loader->>Loader: Merge Configurations
    Loader->>Validator: Validate Merged Config
    Validator->>Loader: Validation Result
    Loader->>Cache: Store Config
    Cache->>App: Config Ready
```

## Configuration Validation

### Schema Validation

```javascript
// Example schema validation
const configSchema = {
  type: "object",
  properties: {
    version: { type: "string", pattern: "^\\d+\\.\\d+\\.\\d+$" },
    modes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", minLength: 1 },
          text: { type: "string", minLength: 1 },
          url: { type: "string", format: "uri" },
          dir: { type: "boolean" }
        },
        required: ["id", "text"]
      }
    }
  },
  required: ["version", "modes"]
};
```

### Validation Flow

```mermaid
graph TD
    Input[Configuration Input] --> Parse[Parse JSON]
    Parse --> SchemaCheck[Schema Validation]
    SchemaCheck --> TypeCheck[Type Validation]
    TypeCheck --> BusinessLogic[Business Logic Validation]
    BusinessLogic --> SecurityCheck[Security Validation]
    SecurityCheck --> Success[Valid Configuration]
    
    Parse --> ParseError[Parse Error]
    SchemaCheck --> SchemaError[Schema Error]
    TypeCheck --> TypeError[Type Error]
    BusinessLogic --> LogicError[Logic Error]
    SecurityCheck --> SecurityError[Security Error]
```

## Configuration Synchronization

### Remote Sync Architecture

```mermaid
graph LR
    subgraph "Local"
        LocalConfig[Local Config]
        SyncManager[Sync Manager]
        ConflictResolver[Conflict Resolver]
    end
    
    subgraph "Remote"
        RemoteConfig[Remote Config]
        SyncAPI[Sync API]
        VersionControl[Version Control]
    end
    
    LocalConfig --> SyncManager
    SyncManager --> ConflictResolver
    ConflictResolver --> SyncAPI
    SyncAPI --> RemoteConfig
    RemoteConfig --> VersionControl
```

### Sync Process

```mermaid
sequenceDiagram
    participant Local as Local Config
    participant Sync as Sync Manager
    participant Remote as Remote Server
    participant User as User
    
    User->>Local: Modify Configuration
    Local->>Sync: Trigger Sync
    Sync->>Remote: Check Remote Version
    Remote->>Sync: Remote Version Info
    
    alt Remote is newer
        Sync->>Remote: Fetch Remote Config
        Remote->>Sync: Remote Config Data
        Sync->>User: Conflict Resolution Required
        User->>Sync: Resolution Choice
        Sync->>Local: Apply Resolved Config
    else Local is newer
        Sync->>Remote: Push Local Config
        Remote->>Sync: Sync Success
    else Same version
        Sync->>Local: No sync needed
    end
```

## Configuration Hot Reloading

```mermaid
graph TB
    FileChange[Config File Change] --> Watcher[File Watcher]
    Watcher --> Debounce[Debounce Changes]
    Debounce --> Reload[Reload Config]
    Reload --> Validate[Validate New Config]
    Validate --> Merge[Merge with Existing]
    Merge --> Apply[Apply Changes]
    Apply --> Notify[Notify Components]
    
    Validate --> Error[Validation Error]
    Error --> Revert[Revert to Previous]
    Error --> NotifyError[Notify User]
```

## Configuration API

### Reading Configuration

```javascript
// Get configuration value
const theme = noi.config.get('appearance.theme');

// Get with default value
const fontSize = noi.config.get('appearance.fontSize', 14);

// Get entire section
const appearance = noi.config.get('appearance');
```

### Writing Configuration

```javascript
// Set single value
noi.config.set('appearance.theme', 'dark');

// Set multiple values
noi.config.set({
  'appearance.theme': 'dark',
  'appearance.fontSize': 16
});

// Update with validation
try {
  await noi.config.update('behavior.cacheMode', true);
} catch (error) {
  console.error('Invalid configuration:', error);
}
```

### Watching Configuration Changes

```javascript
// Watch specific key
noi.config.watch('appearance.theme', (newValue, oldValue) => {
  console.log(`Theme changed from ${oldValue} to ${newValue}`);
});

// Watch section
noi.config.watch('appearance.*', (changes) => {
  console.log('Appearance settings changed:', changes);
});

// Watch all changes
noi.config.watch('*', (changes) => {
  console.log('Configuration changed:', changes);
});
```

## Configuration Security

### Secure Storage

```mermaid
graph LR
    subgraph "Security Layers"
        Encryption[File Encryption]
        Permissions[File Permissions]
        Validation[Input Validation]
        Sanitization[Data Sanitization]
    end
    
    subgraph "Threat Mitigation"
        Injection[Code Injection]
        Tampering[File Tampering]
        Privilege[Privilege Escalation]
        Disclosure[Information Disclosure]
    end
    
    Encryption --> Tampering
    Permissions --> Privilege
    Validation --> Injection
    Sanitization --> Disclosure
```

### Security Best Practices

1. **Encrypt sensitive data**: API keys, tokens, and personal information
2. **Validate all inputs**: Never trust user-provided configuration data
3. **Sandbox configuration**: Limit configuration access to authorized components
4. **Audit configuration changes**: Log all configuration modifications
5. **Regular backups**: Maintain configuration backups for recovery

## Configuration Migration

### Version Migration

```javascript
// Migration example
class ConfigMigration {
  static migrations = {
    '1.0.0': (config) => {
      // Migrate from v0.x to v1.0.0
      if (config.theme) {
        config.appearance = { theme: config.theme };
        delete config.theme;
      }
      return config;
    },
    '1.1.0': (config) => {
      // Migrate from v1.0.0 to v1.1.0
      if (!config.behavior) {
        config.behavior = {
          cacheMode: true,
          cookieIsolation: false
        };
      }
      return config;
    }
  };
  
  static migrate(config, targetVersion) {
    const currentVersion = config.version || '0.1.0';
    let migratedConfig = { ...config };
    
    for (const [version, migrationFn] of Object.entries(this.migrations)) {
      if (this.isVersionGreater(version, currentVersion)) {
        migratedConfig = migrationFn(migratedConfig);
      }
    }
    
    migratedConfig.version = targetVersion;
    return migratedConfig;
  }
}
```

## Troubleshooting

### Common Issues

1. **Configuration not loading**: Check file permissions and syntax
2. **Invalid JSON**: Use a JSON validator to check syntax
3. **Schema validation errors**: Review the configuration schema
4. **Sync conflicts**: Use conflict resolution strategies
5. **Performance issues**: Optimize configuration size and structure

### Debug Tools

```javascript
// Enable configuration debugging
noi.config.setDebugMode(true);

// Export current configuration
const config = noi.config.export();
console.log('Current configuration:', config);

// Validate configuration
const isValid = noi.config.validate();
console.log('Configuration is valid:', isValid);
```

## Best Practices

1. **Use semantic versioning**: Follow semantic versioning for configuration schemas
2. **Provide defaults**: Always provide sensible default values
3. **Document changes**: Document configuration changes and migrations
4. **Test migrations**: Thoroughly test configuration migrations
5. **Backup before changes**: Always backup configuration before major changes
6. **Use validation**: Implement comprehensive validation for all configuration data
7. **Monitor performance**: Keep configuration access performant
8. **Secure sensitive data**: Encrypt and protect sensitive configuration data

This documentation provides a comprehensive guide to Noi's configuration system. For more specific implementation details, refer to the source code and API documentation.