# Prism onboarding and TV package hosting

This repository is the public setup site and package host for [Prism](https://github.com/Josh-MH/Prism), a Samsung Tizen signage app connected to a Supabase backend and a user's own Grok Bot or Claude agent. The app shows local time and weather, rotating information cards, timely alerts, and a local Grok Voice interface. An agent can publish cards only after a person approves it with a code shown on the TV and it takes an exclusive, time-limited claim.

The [source repository](https://github.com/Josh-MH/Prism) contains the TV app, Supabase migrations and Edge Functions, tests, build tooling, and the source Prism Display skill. This repository contains the public onboarding copy, the hosted signed pilot package, and the browser side of one-use screen sharing. The public site is **https://josh-mh.github.io/prism-onboarding/**.

## Current hosted release

| Item | URL | Purpose |
| --- | --- | --- |
| Onboarding page | https://josh-mh.github.io/prism-onboarding/ | Human setup flow and agent prompt |
| Agent guide | https://josh-mh.github.io/prism-onboarding/agent-guide.txt | Step-by-step instructions for a new personal agent |
| Prism MCP | https://szjlowelnukjetjzizww.supabase.co/functions/v1/prism-mcp | OAuth connector, display and content tools |
| Prism Display skill | https://josh-mh.github.io/prism-onboarding/skills/prism-display/SKILL.md | Detailed agent operating and card-authoring rules |
| Skill ZIP | https://josh-mh.github.io/prism-onboarding/prism-display-skill.zip | Skill upload package for Claude |
| Samsung Custom App URL | https://josh-mh.github.io/prism-onboarding/tv/pilot/ | Folder containing the Samsung manifest and signed WGT |
| Pilot checklist | https://josh-mh.github.io/prism-onboarding/pilot-test.md | Physical install and first-user test steps |

The hosted TV package is **Prism 2.0.83** with application ID `LmOpunhFNs.MathisAIRoomDiagnostic`. `tv/pilot/sssp_config.xml` names the version and exact byte size of `tv/pilot/MathisAIRoomDiagnostic.wgt`; Samsung's Custom App / URL Launcher reads that folder URL. Enter the **folder URL**, including its trailing slash, in the TV settings. The root onboarding page is for people and agents and is not a TV installation URL.

The current pilot distributor certificate covers **Josh Hamil's Office and Joe Burrage's Office TVs**. This package is tied to those approved Samsung device IDs. It cannot be assumed to install on another TV, even one of the same model. General deployment requires an appropriate Samsung production/B2B signing path and physical validation. A hosted manifest or successful upload alone does not prove that either TV installed the new version; check the TV's Display Status after updating it.

## How setup and operation work

1. Install the signed app on an authorized TV using the Custom App URL above. Give the TV internet access and set its local clock and time zone. On first use the app registers with Prism and displays a rotating five-minute pairing code.
2. Add the Prism MCP URL as a remote connector in Grok Bot or Claude and complete its anonymous OAuth flow in that host. Read or install the [Prism Display skill](skills/prism-display/SKILL.md) separately. The guide explains the host-specific steps; reading it does not install a connector.
3. Give the agent the code shown on the TV. It inspects the code, collects the display name, location, space type, and five-digit weather ZIP for a new TV, then calls `approve_display`. Each agent connection needs its own approval for each TV.
4. When asked, the agent claims the TV for a chosen 5–1440 minute lease. Only its current claim owner can publish or remove cards and use owner-specific Voice handoff. One agent may claim multiple approved TVs; each TV has one claim owner at a time.
5. The owner publishes informative rotating cards or timely priority cards through Prism MCP. The backend sends them over the live channel; card HTML remains in TV memory until expiry, claim change, or app restart. The agent checks `get_screen_content` and the exact loaded revision for important sends.

The TV can answer public questions through Grok Voice and can contact the current owner's agent through a private webhook when a personal answer or persistent action is needed. Remote **1** starts or ends Voice; remote **2** toggles local “Hey Grok” listening for the current app session, which starts off; remote **0** enables local privacy mode. The wake detector runs on the TV, but real-room recognition still needs physical validation. Ordinary Voice ends after 10 seconds of silence following speech; an owner follow-up permits 15 seconds. Optional iBeacon presence can gate selected cards and owner handoffs, and a distinct BCPro21 button beacon can toggle Voice. Set its trigger burst to 2 seconds and allow roughly 4 seconds between presses; the second distinct press ends Voice as remote 1 does. The beacon is a convenience signal, not authentication.

## Files in this repository

| Path | Role |
| --- | --- |
| `index.html` | Public onboarding page and copyable setup prompt |
| `agent-guide.txt` | Detailed setup instructions for an agent |
| `skills/prism-display/SKILL.md` | Readable published skill, synchronized from the source repository |
| `prism-display-skill.zip` | Uploadable skill archive |
| `share/index.html` | Chrome WebRTC sender opened by a one-use link created by Prism MCP |
| `tv/pilot/sssp_config.xml` | Samsung Custom App version and WGT byte-size manifest |
| `tv/pilot/MathisAIRoomDiagnostic.wgt` | Signed, device-limited TV package |
| `pilot-test.md` | Guided reset and pairing test for an authorized TV |

The screen-sharing page does not issue invitations. The claim owner creates a one-use, five-minute link with `create_screen_share_link`; Chrome then asks the person to select a tab, window, or screen. Sharing across networks requires a public TURN relay, which is not yet provisioned for this pilot. The sender and receiver have been exercised on the same network only.

## Updating the hosted release

1. Make TV, backend, and skill changes in [Prism](https://github.com/Josh-MH/Prism). Run its tests, build, and Edge Function checks. Keep the app version in `src/app.js` and `MathisAIRoomDiagnostic/config.xml` aligned.
2. Review and deploy changed Supabase migrations and functions separately. The GitHub Pages files here do not deploy the backend.
3. Sign the Tizen project with the existing `MathisAIRoom` author and distributor profile. Confirm the WGT contains the app assets plus Samsung author and distributor signatures. Keep certificates and private keys out of Git.
4. Copy the WGT into `tv/pilot/` and set `<ver>` and `<size>` in `sssp_config.xml` to its exact version and byte count. Copy the current skill to `skills/prism-display/SKILL.md` and rebuild `prism-display-skill.zip` from that file.
5. Commit and push this repository. Wait for GitHub Pages to serve both the new manifest and WGT. Then refresh Custom App on the intended TV and verify its `appVersion` in Display Status. The owner may need to renew the claim and republish cards after an app restart.

The WGT is public to download but its distributor signature limits where it can be installed. This repository contains no OAuth tokens, Supabase service keys, webhook credentials, signing certificates, private screen-share links, or device-identifying DUIDs. Keep those in the host's secret storage or ignored local files.
