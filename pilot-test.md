# Prism clean-slate pilot test

Use this checklist on the Samsung QM32C whose device ID is already included in the pilot signing certificate. Keep the TV's current settings until you are ready to run the test.

## Prepare the clean slate

1. Before erasing anything, record the TV model, Tizen version, network settings, current Custom App URL, and any settings you need to restore. Confirm that you can reach this page from a computer on the same network. A factory reset can remove the app and network setup.
2. In the bot host, remove the existing Prism connector authorization, Prism Display skill, and any Prism claim routines from the test bot. Create a new bot or conversation and add the connector again so OAuth creates a fresh Prism connection. A new conversation that still uses the old connector is **not** a first-user test; its approved TVs can reappear.
3. To test a TV that has never enrolled, clear the Prism app's stored data through the TV's supported reset procedure, or factory-reset the TV and reinstall the Custom App. Merely choosing **Remove all bot approvals** inside Prism leaves its server-side display name, location, and ZIP in place. Reinstalling the app without clearing its storage may also reuse the old TV identity. Do not delete the old server display record before the reset; it provides a recovery reference if setup fails.
4. Once the app starts, check the screen before pairing. It must show a code without the previous shared display name. If that name remains, stop: the TV is still using its prior enrollment, so this run does not test first enrollment. A newly reset app registers a new TV identity; the prior server record may remain inactive, but a fresh bot connection will not see it without approval.

## Run the onboarding test

1. In the TV's Custom App or URL Launcher settings, enter `https://josh-mh.github.io/prism-onboarding/tv/pilot/` exactly. Expect Prism 2.0.81 to install and open. Record the exact error if installation fails.
2. On the unconfigured TV, expect the local date and time and a five-minute pairing code in the lower right. There should be no shared display name, owner card, or listening indicator. If it says `OFFLINE`, check network access and record the message in Display Settings.
3. In a brand-new Grok Bot or Claude conversation, paste the prompt on the [onboarding page](./). Complete the Prism MCP connector setup and its OAuth consent in the host's UI. The bot should call `list_displays` and report zero approved TVs.
4. Give the bot the current TV code. It should call `inspect_pairing_code` without consuming it, then ask separately for a common name, physical location, five-digit US weather ZIP, and office or public space. If the code expires while answering, use the current code before approval.
5. After `approve_display`, the bot should confirm the TV appears in `list_displays` as approved and unclaimed. The TV should display the shared name and use the saved ZIP for local weather. A second pairing should retrieve the saved details without asking for them again.
6. Ask the bot to explain approval versus a claim, the status ring, privacy mode, and an optional iBeacon. The beacon should be offered, not required. If you opt in, test it only after confirming the TV reports BLE support.
7. Approve a short claim and publish one generic sample card. Confirm the page ID using `get_screen_content` and check the physical screen. Test remote **0** for privacy mode and the status ring. Only then decide whether to set a daily claim routine in the bot host.
8. For a multi-TV check, repeat pairing on another authorized display. The same bot should list both TVs and be able to claim each independently. A different bot requires its own physical pairing code for each TV.

Send back the first step that differs from these expectations, with the exact on-screen or connector error. Do not send OAuth tokens, webhook keys, or iBeacon UUID/major/minor in a public report.

The pilot package is tied to approved Samsung device IDs. Installation on an arbitrary customer TV still requires a production/B2B signing path.
