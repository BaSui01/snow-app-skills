## Summary

<!-- What changes, and which failure mode does it fix? -->

## Type

- [ ] New skill
- [ ] Skill behavior change
- [ ] Documentation or CI

## Checklist

- [ ] `node scripts/validate-skills.mjs` passes locally.
- [ ] `SKILL.md` frontmatter has `name` and `description`, and `name` matches the folder.
- [ ] The skill is linked from `README.md` and `README.zh-CN.md`.
- [ ] No machine-specific paths, credentials, or private project names.
- [ ] Positive trigger, negative trigger, and permission boundary were tested.
- [ ] Stop conditions and forbidden actions are explicit in the skill body.

## Related issue

<!-- Link the issue this closes, if any. -->
