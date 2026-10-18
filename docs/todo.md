# Task List

Just a simple tracker for what's next for Kratos

- [x] Improve Shell (Move to `just-bash`)
  - This has since been completed!
  - Fully moved to `just-bash`
- [ ] Memory layer should be utilized as required
  - This is happening now in Build
  - [x] But, the issue is that the AppDirectory is not mounted so that needs fixing
- [ ] Each mode should serve it's purpose (`build`, `discuss` and `court`)
  - [x] Build
    - Now this is the velocity driving mode,
    but that does not necessarily mean it does everything
  - [x] Discuss
    - This is in good shape now, so let's leave it at this for now
  - [ ] Court
- [ ] Add Evals
  - This will help test out LLM outputs, rather critical for that

UX Features

- [ ] Better UX in Input
  - Currently after N number of chars, it looks janky
  - [ ] Add markdown support
  - [ ] Expand the input to support new lines

Bugs

- [ ] Exiting process, kills terminal [Use workaround from here for POSIX](https://github.com/anomalyco/opencode/issues/22003)
  - This only happens on Windows AFAIK
- [x] Fix markdown styling, it's breaking with code
