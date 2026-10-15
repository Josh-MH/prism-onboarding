# Prism clean-slate pilot test

Use this checklist on the Samsung QM32C whose device ID is already included in the pilot signing certificate. Keep the TV's current settings until you are ready to run the test.

1. In the TV's Custom App or URL Launcher settings, enter `https://josh-mh.github.io/prism-onboarding/tv/pilot/` exactly. Expect Prism 2.0.64 to install and open. Record the TV model, Tizen version, and exact error if installation fails.
2. On the unconfigured TV, expect the local date and time and a five-minute pairing code in the lower right. There should be no shared display name, owner card, or listening indicator. If it says `OFFLINE`, check network access and record the message in Display Settings.
3. In a brand-new Grok Bot or Claude conversation, paste the prompt on the [onboarding page](./). Complete the Prism MCP connector setup and its OAuth consent in the host's UI. The bot should call `list_displays` and report zero approved TVs.
4. Give the bot the current TV code. It should call `inspect_pairing_code` without consuming it, then ask separately for a common name, physical location, five-digit US weather ZIP, and office or public space. If the code expires while answering, use the current code before approval.
5. After `approve_display`, the bot should confirm the TV appears in `list_displays` as approved and unclaimed. The TV should display the shared name and use the saved ZIP for local weather. A second pairing should retrieve the saved details without asking for them again.
6. Ask the bot to explain approval versus a claim, the status ring, privacy mode, and an optional iBeacon. The beacon should be offered, not required. If you opt in, test it only after confirming the TV reports BLE support.
7. Approve a short claim and publish one generic sample card. Confirm the page ID using `get_screen_content` and check the physical screen. Test remote **0** for privacy mode and the status ring. Only then decide whether to set a daily claim routine in the bot host.
8. For a multi-TV check, repeat pairing on another authorized display. The same bot should list both TVs and be able to claim each independently. A different bot requires its own physical pairing code for each TV.

Send back the first step that differs from these expectations, with the exact on-screen or connector error. Do not send OAuth tokens, webhook keys, or iBeacon UUID/major/minor in a public report.

The pilot package is tied to approved Samsung device IDs. Installation on an arbitrary customer TV still requires a production/B2B signing path.
