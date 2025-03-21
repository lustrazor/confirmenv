import React from 'react';

export default async function Home() {
  // Get all environment variables
  const envVars = { ...process.env };
  
  // Directly access the critical environment variables
  const criticalVars = {
    ARTIFACT_API_KEY: process.env.ARTIFACT_API_KEY || 'Not set',
    ARTIFACT_API_SECRET: process.env.ARTIFACT_API_SECRET || 'Not set',
    ARTIFACT_URI: process.env.ARTIFACT_URI || 'Not set',
    CONGEAL_USERNAME: process.env.CONGEAL_USERNAME || 'Not set',
    MONGODB_URI: process.env.MONGODB_URI || 'Not set'
  };
  
  // Count total environment variables
  const totalEnvVars = Object.keys(envVars).length;
  
  // Get build information
  const buildInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    nextVersion: process.env.NEXT_VERSION || 'Unknown',
    nodeEnv: process.env.NODE_ENV || 'Not set'
  };
  
  // Filter environment variables for the secondary display
  const filteredEnvVars = Object.entries(envVars).filter(([key]) => {
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
           key !== 'COOLIFY_BRANCH' &&
           key !== 'COOLIFY_RESOURCE_UUID' &&
           key !== 'HOST' &&
           key !== 'IS_NEXT_WORKER' &&
           key !== 'RUST_MIN_STACK' &&
           key !== 'SOURCE_COMMIT' &&
           key !== 'YARN_VERSION';
  });
  
  // Check if we have any Coolify-specific variables
  const coolifySpecificVars = Object.entries(envVars)
    .filter(([key]) => key.startsWith('COOLIFY_'))
    .reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>);
  
  // Sort remaining environment variables alphabetically
  const sortedEnvVars = filteredEnvVars.sort(([a], [b]) => a.localeCompare(b));

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto mt-20">
        <h1 className="text-3xl font-bold mb-8 text-gray-700">Environment Variables</h1>
        
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Critical Variables</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-10">
          <div className="grid grid-cols-[auto,1fr] gap-x-4">
            {Object.entries(criticalVars).map(([key, value]) => (
              <div key={key} className="contents">
                <div className="px-8 pb-1 pt-6 font-mono font-bold text-sm border-t border-gray-100 text-blue-800">
                  {key}
                </div>
                <div className="px-10 py-3 font-mono text-sm border-b border-gray-100 break-all bg-blue-50 text-blue-900">
                  {String(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-4 text-gray-600">Other Environment Variables</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-[auto,1fr] gap-x-4 text-gray-600">
            {sortedEnvVars.map(([key, value]) => (
              <div key={key} className="contents">
                <div className="px-8 pb-1 pt-6 font-mono font-bold text-sm border-t border-gray-100">
                  {key}
                </div>
                <div className="px-10 py-3 font-mono text-sm border-b border-gray-100 break-all bg-gray-50">
                  {String(value)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h3>
          <p className="text-sm text-yellow-700 mb-2">
            If critical variables are showing as &quot;Not set&quot;, this could mean:
          </p>
          <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
            <li>The environment variables are not correctly set in Coolify</li>
            <li>The environment variables are not being passed to the container</li>
            <li>They are set as build-time variables but not passed to runtime</li>
            <li>The Node.js process cannot access the environment variables</li>
          </ul>
          
          <div className="mt-4 pt-4 border-t border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">System Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-yellow-700">
              <div>Node Version:</div>
              <div>{buildInfo.nodeVersion}</div>
              <div>Platform:</div>
              <div>{buildInfo.platform} ({buildInfo.arch})</div>
              <div>Node Environment:</div>
              <div>{buildInfo.nodeEnv}</div>
              <div>Total ENV Variables:</div>
              <div>{totalEnvVars}</div>
            </div>
          </div>
          
          {Object.keys(coolifySpecificVars).length > 0 && (
            <div className="mt-4 pt-4 border-t border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Coolify Variables Detected</h4>
              <div className="grid grid-cols-2 gap-2 text-sm font-mono text-yellow-700">
                {Object.entries(coolifySpecificVars).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <div>{key}:</div>
                    <div>{value}</div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-yellow-200">
            <p className="text-sm text-yellow-800 font-semibold">Recommended Coolify Settings:</p>
            <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1 mt-2">
              <li>Make sure <span className="font-mono">Build Variable</span> is checked</li>
              <li>For variables with special characters, check <span className="font-mono">Is Literal</span></li>
              <li>If using multiline variables, check <span className="font-mono">Is Multiline</span></li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
