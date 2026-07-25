#define MyAppName "FadeMemo"
#define MyAppVersion "0.0.1-alpha.3"
#define MyAppPublisher "FadeMemo"
#define MyAppExeName "fade_memo.exe"

[Setup]
AppId={{1BCB3450-2A39-4D9F-A59F-7D6A9E70C3F1}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\FadeMemo
DefaultGroupName=FadeMemo
DisableProgramGroupPage=yes
OutputDir=..\dist
OutputBaseFilename=FadeMemo-Setup-0.0.1-alpha.3
SetupIconFile=..\windows\runner\resources\app_icon.ico
UninstallDisplayIcon={app}\{#MyAppExeName}
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog
VersionInfoVersion=0.0.1.3
VersionInfoCompany=FadeMemo
VersionInfoDescription=FadeMemo 安装程序
VersionInfoProductName=FadeMemo
VersionInfoProductVersion=0.0.1.3

[Tasks]
Name: "desktopicon"; Description: "创建桌面快捷方式"; GroupDescription: "附加任务："; Flags: unchecked

[Files]
Source: "..\build\windows\x64\runner\Release\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\FadeMemo"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\FadeMemo"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "启动 FadeMemo"; Flags: nowait postinstall skipifsilent
