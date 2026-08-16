# Uploaded Meeting Conflict Decisions

The combined source inventory contained **49** meeting IDs requiring precedence decisions. Each decision uses the same documented rule: prefer an active record over inactive/archived data, then prefer a record with a complete non-approximate address and coordinates, then prefer the latest source update.

By the rule, **49** conflict decisions use a latest-update tie-breaker and **49** include a higher-quality address or coordinate record. These decisions remain source-audit evidence and do not automatically publish a record that fails the application QA gate.

Approximate online or regional records are retained as online or draft candidates and are not represented as exact in-person venues. Inactive source rows are not reactivated merely because they occur in an older export.
