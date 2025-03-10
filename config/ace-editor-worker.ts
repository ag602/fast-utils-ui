import * as ace from 'ace-builds'

// Configure Ace Editor workers
export function configureAceEditor() {
  // Disable workers to prevent the worker loading error
  ace.config.setDefaultValue('session', 'useWorker', false)
}
