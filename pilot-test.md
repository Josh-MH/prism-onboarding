# Prism clean-slate pilot test

Use this checklist on a Samsung Office TV whose device ID is already included in the pilot signing certificate. Keep the TV's current settings until you are ready to run the test.

## Prepare the clean slate

1. Before erasing anything, record the TV model, Tizen version, network settings, current Custom App URL, and any settings you need to restore. Confirm that you can reach this page from a computer on the same network. A factory reset can remove the app and network setup.
2. In the bot host, remove the existing Prism connector authorization, Prism Display skill, and any Prism claim routines from the test bot. Create a new bot or conversation and add the connector again so OAuth creates a fresh Prism connection. A new conversation that still uses the old connector is **not** a first-user test; its approved TVs can reappear.
3. Decide which case you are testing: a new agent on an already-enrolled Office TV, or a genuinely never-enrolled TV. For the first case, keep the TV record and its shared name, location, and ZIP; a new connector still needs its own pairing approval. For the second case, use a TV that has never registered. Clearing app data or factory-resetting an enrolled TV may recover its prior server identity from the DUID binding, so it is not a reliable never-enrolled test. Record network and Custom App settings before any reset.
4. Once the app starts, check for the rotating code. An enrolled TV may also show its previous shared name; a never-enrolled TV should have no shared name yet. Do not delete the existing server display record just to force the latter state.

## Run the onboarding test

1. In the TV's Custom App or URL Launcher settings, enter `https://josh-mh.github.io/prism-onboarding/tv/pilot/` exactly. Expect Prism 2.0.85 to install and open. Record the exact error if installation fails.
2. Expect the Prism bot animation to play once and fade away while the local date, time, weather, display location, and five-minute pairing code remain visible above it. A never-enrolled TV has no shared display name yet; an existing Office TV may show its saved name. There should be no owner card or listening indicator. If it says `OFFLINE`, check network access and record the message in Display Settings.
3. In a brand-new Grok Bot or Claude conversation, paste the prompt on the [onboarding page](./). Complete the Prism MCP connector setup and its OAuth consent in the host's UI. The bot should call `list_displays` and report zero approved TVs.
4. Give the bot the current TV code. It should call `inspect_pairing_code` without consuming it. For a new display it should ask separately for a common name, physical location, five-digit US weather ZIP, and office or public space; for an existing display it should preserve the saved details. If the code expires while answering, use the current code before approval.
5. After `approve_display`, the bot should confirm the TV appears in `list_displays` as approved and unclaimed. The TV should display the shared name and use the saved ZIP for local weather. A second pairing should retrieve the saved details without asking for them again.
6. Ask the bot to explain approval versus a claim, the status ring, privacy mode, and an optional iBeacon. The beacon should be offered, not required. If you opt in, test it only after confirming the TV reports BLE support.
7. Approve a short claim. The Prism bot animation should replay once and fade away. Publish one generic sample card, confirm the page ID using `get_screen_content`, and check the physical screen. Test remote **0** for privacy mode and the status ring. Only then decide whether to set a daily claim routine in the bot host.
8. For a multi-TV check, repeat pairing on another authorized display. The same bot should list both TVs and be able to claim each independently. A different bot requires its own physical pairing code for each TV.

Send back the first step that differs from these expectations, with the exact on-screen or connector error. Do not send OAuth tokens, webhook keys, or iBeacon UUID/major/minor in a public report.

The pilot package is tied to approved Samsung device IDs. Installation on an arbitrary customer TV still requires a production/B2B signing path.
