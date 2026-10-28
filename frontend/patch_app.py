import re

with open("src/App.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# Add imports
code = code.replace(
    "import BusinessAdmin from './components/BusinessAdmin'",
    "import BusinessAdmin from './components/BusinessAdmin'\nimport SplashScreen from './components/SplashScreen'\nimport RoleSwitcherSheet from './components/RoleSwitcherSheet'\nimport StaffSupportModal from './components/StaffSupportModal'"
)

# Add state
code = code.replace(
    "const [mode, setMode] = useState<Mode>('client')",
    "const [showSplash, setShowSplash] = useState(true)\n  const [mode, setMode] = useState<Mode>('client')"
)

# Update profileRole to include worker
code = code.replace(
    "useState<'client' | 'business'>",
    "useState<'client' | 'business' | 'worker'>"
)

# Remove 'Для бизнеса' button for signed-in and guests
code = re.sub(
    r'\{isBusiness \? \([\s\S]*?\) : \([\s\S]*?<button[\s\S]*?👑 \{balance[^}]*\}[\s\S]*?</button>[\s\S]*?\)\}',
    r"""<button onClick={() => { setMode('client'); setClientTab('wallet'); }} className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-1.5 text-sm font-semibold text-accent transition active:scale-95">👑 {balance.toLocaleString(lang === 'EN' ? 'en-US' : 'ru-RU')} <span className="font-medium">{tr('бонусов')}</span></button>""",
    code
)

code = re.sub(
    r'<button\s*onClick=\{[^}]*role: \'business\'[^}]*\}[\s\S]*?</button>',
    '',
    code
)

# Replace Role Switcher tablist with pill
tablist_regex = r'<div role="tablist" className="flex w-full rounded-\[14px\] bg-secondary p-1">[\s\S]*?</div>'
pill_replacement = """
                <button
                  onClick={() => setProfileRoleSheet(true)}
                  className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition hover:bg-secondary/50 active:scale-[0.99]"
                >
                  <span className="text-sm font-medium text-foreground">
                    Вы вошли как: <span className="font-semibold text-primary">{profileRole === 'business' ? 'Бизнес' : profileRole === 'worker' ? 'Сотрудник' : 'Клиент (Камила)'}</span>
                  </span>
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m8 6H4m0 0l4 4m-4-4l4-4"/></svg>
                </button>
"""
code = re.sub(tablist_regex, pill_replacement.strip(), code)

# Add profileRoleSheet state
code = code.replace(
    "const [profileRole, setProfileRole]",
    "const [profileRoleSheet, setProfileRoleSheet] = useState(false)\n  const [profileRole, setProfileRole]"
)

# Inject RoleSwitcherSheet
code = code.replace(
    "{bizPageOpen && (",
    """
      {profileRoleSheet && (
        <RoleSwitcherSheet
          activeRole={profileRole as 'client' | 'business' | 'worker'}
          onSwitch={(r) => {
            setProfileRole(r)
            if (r === 'worker') {
              setMode('worker')
              setWorkerTab('profile')
            } else {
              setMode('client')
              setClientTab('profile')
            }
          }}
          onClose={() => setProfileRoleSheet(false)}
        />
      )}
      {bizPageOpen && ("""
)

# Add Splash Screen
code = code.replace(
    "return (\n    <LangProvider lang={lang}>",
    "return (\n    <>\n      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}\n      <LangProvider lang={lang}>"
)

code = code.replace(
    "    </LangProvider>\n  )\n}",
    "    </LangProvider>\n    </>\n  )\n}"
)

with open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(code)
