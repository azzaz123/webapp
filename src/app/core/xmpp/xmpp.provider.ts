// FIXME: Forcing Stanza build to be included in the chat chunk and loading Stanza in a sync way
// Previously imported in the `scripts.js` file
// Possible alternatives of this quick fix:
// - Upgrade Stanza
// - Load Stanza as an external asset
// - Use another XMPP provider
import * as StanzaIO from 'stanza.io/build/stanzaio.bundle.js';
export { StanzaIO };
