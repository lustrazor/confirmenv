export default async function Home() {
  // Get all environment variables
  const envVars = { ...process.env };
  
  // Important Coolify variables that we want to ensure are displayed
  const importantVars = [
    'ARTIFACT_API_KEY',
    'ARTIFACT_API_SECRET',
    'ARTIFACT_URI',
    'CONGEAL_USERNAME',
    'MONGODB_URI'
  ];
  
  // Filter out Next.js internal variables and system variables
  const filteredEnvVars = Object.entries(envVars).filter(([key]) => {
    // Always include important variables
    if (importantVars.includes(key)) {
      return true;
    }
    
    // Exclude Next.js internal variables and system variables
    return !key.startsWith('_') && 
           !key.startsWith('NEXT_') && 
           !key.startsWith('NODE_') &&
           !key.startsWith('CONDA_') &&
           !key.startsWith('GIT_') &&
           !key.startsWith('HOMEBREW_') &&
           !key.startsWith('TERM_') &&
           !key.startsWith('SHELL_') &&
           !key.startsWith('LANG_') &&
           !key.startsWith('LC_') &&
           !key.startsWith('SSH_') &&
           !key.startsWith('DOCKER_') &&
           !key.startsWith('COMPOSE_') &&
           !key.startsWith('VSCODE_') &&
           !key.startsWith('npm_') &&
           !key.startsWith('GSETTINGS_') &&
           !key.startsWith('PYENV_') &&
           !key.startsWith('XPC_') &&
           key !== 'PATH' &&
           key !== 'HOME' &&
           key !== 'PWD' &&
           key !== 'TERM' &&
           key !== 'SHELL' &&
           key !== 'LANG' &&
           key !== 'LC_ALL' &&
           key !== 'USER' &&
           key !== 'LOGNAME' &&
           key !== 'GROUP' &&
           key !== 'HOSTNAME' &&
           key !== 'SHLVL' &&
           key !== 'COLOR' &&
           key !== 'COLORTERM' &&
           key !== 'COMMAND_MODE' &&
           key !== 'CURSOR_TRACE_ID' &&
           key !== 'EDITOR' &&
           key !== 'INFOPATH' &&
           key !== 'INIT_CWD' &&
           key !== 'MallocNanoZone' &&
           key !== 'NODE' &&
           key !== 'ORIGINAL_XDG_CURRENT_DESKTOP' &&
           key !== 'PORT' &&
           key !== 'TMPDIR' &&
           key !== 'USER_ZDOTDIR' &&
           key !== 'WATCHPACK_WATCHER_LIMIT' &&
           key !== 'ZDOTDIR' &&
           // Additional variables to hide
           key !== 'COOLIFY_BRANCH' &&
           key !== 'COOLIFY_RESOURCE_UUID' &&
           key !== 'HOST' &&
           key !== 'IS_NEXT_WORKER' &&
           key !== 'RUST_MIN_STACK' &&
           key !== 'SOURCE_COMMIT' &&
           key !== 'YARN_VERSION';
  });
  
  // Sort environment variables alphabetically
  const sortedEnvVars = filteredEnvVars.sort(([a], [b]) => a.localeCompare(b));

  // Extract the important variables to display at the top
  const coolifyVars = sortedEnvVars.filter(([key]) => importantVars.includes(key));
  const otherVars = sortedEnvVars.filter(([key]) => !importantVars.includes(key));

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto mt-40">
        <h1 className="text-3xl font-bold mb-8 text-gray-400">Environment Variables</h1>
        
        {coolifyVars.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-500">Coolify Variables</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="grid grid-cols-[auto,1fr] gap-x-4 text-gray-600">
                {coolifyVars.map(([key, value]) => (
                  <div key={key} className="contents">
                    <div className="px-8 pb-1 pt-10 font-mono font-bold text-sm border-t border-gray-100">
                      {key}
                    </div>
                    <div className="px-10 py-3 font-mono text-sm border-b border-gray-100 break-all bg-gray-50">
                      {String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        <h2 className="text-xl font-semibold mb-4 text-gray-500">Other Environment Variables</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-[auto,1fr] gap-x-4 text-gray-600">
            {otherVars.map(([key, value]) => (
              <div key={key} className="contents">
                <div className="px-8 pb-1 pt-10 font-mono font-bold text-sm border-t border-gray-100">
                  {key}
                </div>
                <div className="px-10 py-3 font-mono text-sm border-b border-gray-100 break-all bg-gray-50">
                  {String(value)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Note: Coolify variables will appear in the top section when present.
        </p>
      </div>
    </main>
  );
}
