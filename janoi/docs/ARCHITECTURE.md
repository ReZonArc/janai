# Noi Technical Architecture

## Table of Contents
- [System Overview](#system-overview)
- [Core Components](#core-components)
- [Extension System](#extension-system)
- [Data Flow](#data-flow)
- [Configuration Management](#configuration-management)
- [Build & Deployment](#build--deployment)
- [Development Workflow](#development-workflow)

## System Overview

Noi is an AI-enhanced, customizable browser built on Electron that provides seamless integration with multiple AI services and platforms. The application follows a modular architecture with clear separation of concerns.

```mermaid
graph TB
    subgraph "Noi Application"
        UI[User Interface Layer]
        Core[Core Browser Engine]
        Extensions[Extension System]
        Config[Configuration Manager]
        Cache[Cache Manager]
    end
    
    subgraph "External Services"
        AI1[ChatGPT]
        AI2[Claude]
        AI3[Gemini]
        AI4[Other AI Services]
    end
    
    subgraph "Local Storage"
        UserData[User Data]
        ExtData[Extension Data]
        ConfigFiles[Config Files]
    end
    
    UI --> Core
    UI --> Extensions
    Core --> Config
    Core --> Cache
    Extensions --> Core
    Config --> ConfigFiles
    Cache --> UserData
    Extensions --> ExtData
    
    Core --> AI1
    Core --> AI2
    Core --> AI3
    Core --> AI4
```

### Key Architectural Principles

1. **Modularity**: Each component has a specific responsibility and clear interfaces
2. **Extensibility**: Plugin-based architecture allows for easy feature additions
3. **Isolation**: Cookie data isolation supports multiple accounts per service
4. **Performance**: Cache mode optimizes browsing experience
5. **Customization**: Comprehensive configuration system for user preferences

## Core Components

The Noi application consists of several core components that work together to provide the AI-enhanced browsing experience.

```mermaid
graph LR
    subgraph "Main Process (Electron)"
        App[App Controller]
        Window[Window Manager]
        Menu[Menu System]
        Settings[Settings Manager]
    end
    
    subgraph "Renderer Process"
        Browser[Browser View]
        Sidebar[Navigation Sidebar]
        Themes[Theme Engine]
        Prompts[Prompt Manager]
    end
    
    subgraph "Extension Layer"
        Ask[Noi Ask Extension]
        Reset[Noi Reset Extension]
        Custom[Custom Extensions]
    end
    
    App --> Window
    App --> Menu
    App --> Settings
    Window --> Browser
    Browser --> Sidebar
    Browser --> Themes
    Browser --> Prompts
    Browser --> Ask
    Browser --> Reset
    Browser --> Custom
```

### Component Responsibilities

- **App Controller**: Main application lifecycle management
- **Window Manager**: Browser window creation and management
- **Menu System**: Application menus and shortcuts
- **Settings Manager**: User preferences and configuration
- **Browser View**: Web content rendering and navigation
- **Navigation Sidebar**: AI service shortcuts and navigation
- **Theme Engine**: UI theming and customization
- **Prompt Manager**: Prompt storage and management

## Extension System

Noi supports a Chrome-like extension system that allows for enhanced functionality and customization.

```mermaid
graph TD
    subgraph "Extension Architecture"
        Manifest[manifest.json]
        ContentScript[Content Scripts]
        Background[Background Scripts]
        UI[Extension UI]
    end
    
    subgraph "Host Application"
        WebView[WebView Container]
        ExtAPI[Extension APIs]
        IPC[IPC Bridge]
    end
    
    subgraph "AI Services"
        ChatGPT[ChatGPT]
        Claude[Claude]
        Gemini[Gemini]
        Others[Other Services]
    end
    
    Manifest --> ContentScript
    Manifest --> Background
    Manifest --> UI
    
    ContentScript --> WebView
    Background --> ExtAPI
    UI --> IPC
    
    WebView --> ChatGPT
    WebView --> Claude
    WebView --> Gemini
    WebView --> Others
```

### Extension Types

1. **@noi/ask**: Batch messaging and prompt management
2. **@noi/ask-custom**: Custom prompt templates
3. **@noi/reset**: Website style resets for compatibility

### Extension Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant Noi
    participant Extension
    participant AIService
    
    User->>Noi: Load AI Service
    Noi->>Extension: Initialize Extension
    Extension->>Extension: Load Manifest
    Extension->>Noi: Register Content Scripts
    Noi->>AIService: Navigate to Service
    AIService->>Extension: Page Load Complete
    Extension->>AIService: Inject Functionality
    User->>Extension: Use Extension Features
    Extension->>AIService: Modify Page/Send Data
```

## Data Flow

Understanding how data flows through the Noi application is crucial for developers and system administrators.

```mermaid
graph TB
    subgraph "User Input"
        UI_Input[User Interface]
        Shortcuts[Keyboard Shortcuts]
        Menu_Actions[Menu Actions]
    end
    
    subgraph "Application Layer"
        Router[Event Router]
        State[State Manager]
        Cache[Cache Layer]
    end
    
    subgraph "Storage Layer"
        Local[Local Storage]
        Session[Session Storage]
        Files[File System]
    end
    
    subgraph "External Layer"
        AI_APIs[AI Service APIs]
        Web_Content[Web Content]
        Extensions[Extension Scripts]
    end
    
    UI_Input --> Router
    Shortcuts --> Router
    Menu_Actions --> Router
    
    Router --> State
    State --> Cache
    Cache --> Local
    Cache --> Session
    State --> Files
    
    State --> AI_APIs
    State --> Web_Content
    State --> Extensions
    
    Extensions --> AI_APIs
    Web_Content --> Extensions
```

### Data Flow Patterns

1. **User Interaction Flow**: UI events → State management → Action execution
2. **Configuration Flow**: Settings changes → Config validation → File storage
3. **Extension Data Flow**: Extension events → IPC → Main process → Storage
4. **AI Service Flow**: User requests → Extension processing → AI API calls

## Configuration Management

Noi uses a flexible configuration system to manage user preferences and AI service integrations.

```mermaid
graph LR
    subgraph "Configuration Sources"
        Default[Default Config]
        User[User Config]
        Remote[Remote Sync]
        CLI[CLI Arguments]
    end
    
    subgraph "Config Manager"
        Merger[Config Merger]
        Validator[Config Validator]
        Watcher[File Watcher]
    end
    
    subgraph "Config Files"
        Mode[noi.mode.json]
        Settings[settings.json]
        Extensions[extensions.json]
        Prompts[prompts.json]
    end
    
    Default --> Merger
    User --> Merger
    Remote --> Merger
    CLI --> Merger
    
    Merger --> Validator
    Validator --> Mode
    Validator --> Settings
    Validator --> Extensions
    Validator --> Prompts
    
    Watcher --> Mode
    Watcher --> Settings
    Watcher --> Extensions
    Watcher --> Prompts
```

### Configuration Schema

```mermaid
classDiagram
    class NoiConfig {
        +String version
        +ModeConfig[] modes
        +ThemeConfig theme
        +ProxyConfig proxy
        +ExtensionConfig extensions
    }
    
    class ModeConfig {
        +String id
        +String parent
        +String text
        +String url
        +Boolean dir
    }
    
    class ThemeConfig {
        +String current
        +Object customStyles
    }
    
    class ProxyConfig {
        +String proxyRules
        +String proxyBypassRules
    }
    
    NoiConfig --> ModeConfig
    NoiConfig --> ThemeConfig
    NoiConfig --> ProxyConfig
```

## Build & Deployment

The Noi project uses a multi-stage build and deployment process optimized for cross-platform distribution.

```mermaid
graph TB
    subgraph "Development"
        Source[Source Code]
        Extensions[Extensions]
        Docs[Documentation]
    end
    
    subgraph "Build Process"
        Lint[Linting]
        Test[Testing]
        Bundle[Bundling]
        Package[Packaging]
    end
    
    subgraph "Distribution"
        GitHub[GitHub Releases]
        Website[Documentation Site]
        Extensions_Registry[Extensions Registry]
    end
    
    Source --> Lint
    Extensions --> Lint
    Docs --> Lint
    
    Lint --> Test
    Test --> Bundle
    Bundle --> Package
    
    Package --> GitHub
    Docs --> Website
    Extensions --> Extensions_Registry
```

### Build Targets

```mermaid
graph LR
    subgraph "Platform Builds"
        Windows[Windows x64]
        macOS_Intel[macOS x64]
        macOS_ARM[macOS ARM64]
        Linux_AppImage[Linux AppImage]
        Linux_Deb[Linux DEB]
    end
    
    subgraph "Artifacts"
        Setup_EXE[Setup.exe]
        DMG_Intel[Intel.dmg]
        DMG_ARM[ARM64.dmg]
        AppImage[.AppImage]
        DEB[.deb]
    end
    
    Windows --> Setup_EXE
    macOS_Intel --> DMG_Intel
    macOS_ARM --> DMG_ARM
    Linux_AppImage --> AppImage
    Linux_Deb --> DEB
```

## Development Workflow

The development workflow is designed to support rapid iteration while maintaining code quality.

```mermaid
graph TD
    subgraph "Development Cycle"
        Feature[Feature Development]
        Local[Local Testing]
        PR[Pull Request]
        Review[Code Review]
        CI[Continuous Integration]
        Merge[Merge to Main]
        Deploy[Deployment]
    end
    
    subgraph "Quality Gates"
        Lint_Check[Lint Check]
        Unit_Tests[Unit Tests]
        Integration_Tests[Integration Tests]
        Security_Scan[Security Scan]
    end
    
    Feature --> Local
    Local --> PR
    PR --> Review
    Review --> CI
    
    CI --> Lint_Check
    CI --> Unit_Tests
    CI --> Integration_Tests
    CI --> Security_Scan
    
    Lint_Check --> Merge
    Unit_Tests --> Merge
    Integration_Tests --> Merge
    Security_Scan --> Merge
    
    Merge --> Deploy
```

### Development Environment Setup

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Repo as Repository
    participant Env as Environment
    participant App as Application
    
    Dev->>Repo: Clone Repository
    Dev->>Env: Install Dependencies
    Env->>Env: Setup Node.js
    Env->>Env: Install Electron
    Dev->>App: Run Development Build
    App->>Dev: Hot Reload Ready
    Dev->>App: Make Changes
    App->>Dev: Live Updates
```

## Security Considerations

Noi implements several security measures to protect user data and ensure safe browsing.

```mermaid
graph TB
    subgraph "Security Layers"
        Isolation[Process Isolation]
        Sandbox[Renderer Sandbox]
        CSP[Content Security Policy]
        DataProtection[Data Protection]
    end
    
    subgraph "User Data Protection"
        Encryption[Local Encryption]
        SessionManagement[Session Management]
        CookieIsolation[Cookie Isolation]
    end
    
    subgraph "Extension Security"
        Permissions[Permission System]
        CodeValidation[Code Validation]
        APIRestrictions[API Restrictions]
    end
    
    Isolation --> Sandbox
    Sandbox --> CSP
    CSP --> DataProtection
    
    DataProtection --> Encryption
    DataProtection --> SessionManagement
    DataProtection --> CookieIsolation
    
    DataProtection --> Permissions
    Permissions --> CodeValidation
    CodeValidation --> APIRestrictions
```

## Performance Optimization

Noi implements several performance optimization strategies to ensure smooth user experience.

```mermaid
graph LR
    subgraph "Performance Strategies"
        Caching[Smart Caching]
        LazyLoading[Lazy Loading]
        ResourceOpt[Resource Optimization]
        MemoryMgmt[Memory Management]
    end
    
    subgraph "Cache Types"
        WebCache[Web Content Cache]
        ViewCache[View State Cache]
        ConfigCache[Config Cache]
    end
    
    subgraph "Optimization Targets"
        StartupTime[Startup Time]
        MemoryUsage[Memory Usage]
        ResponseTime[Response Time]
        BatteryLife[Battery Life]
    end
    
    Caching --> WebCache
    Caching --> ViewCache
    Caching --> ConfigCache
    
    LazyLoading --> StartupTime
    ResourceOpt --> MemoryUsage
    MemoryMgmt --> ResponseTime
    Caching --> BatteryLife
```

## Future Architecture Considerations

As Noi evolves, several architectural improvements are being considered:

1. **Microservices Architecture**: Breaking down monolithic components
2. **Plugin Marketplace**: Centralized extension distribution
3. **Cloud Sync**: Cross-device synchronization
4. **Mobile Support**: React Native or Flutter implementation
5. **AI Model Integration**: Local AI model support

This architecture document serves as a living guide for understanding and contributing to the Noi project. It will be updated as the system evolves and new features are added.