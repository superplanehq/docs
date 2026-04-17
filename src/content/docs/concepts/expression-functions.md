---
title: Expression Functions Reference
description: Complete list of functions available in SuperPlane expressions.
---

This page lists every function available in SuperPlane expressions. For an introduction to how expressions work, see [Expressions](/concepts/expressions).

---

## SuperPlane

| Function | Description | Example |
| -------- | ----------- | ------- |
| `root()` | Root payload that started the run | `root().data.ref` |
| `previous()` | Immediate upstream node's payload | `previous().data.status` |
| `previous(n)` | Walk n levels upstream | `previous(2).data.version` |

---

## String

| Function | Description | Example |
| -------- | ----------- | ------- |
| `trim(str)` | Remove whitespace from both ends | `trim("  hello  ") == "hello"` |
| `trim(str, chars)` | Remove specific characters | `trim("xxhelloxx", "x") == "hello"` |
| `trimPrefix(str, prefix)` | Remove prefix if present | `trimPrefix("HelloWorld", "Hello") == "World"` |
| `trimSuffix(str, suffix)` | Remove suffix if present | `trimSuffix("HelloWorld", "World") == "Hello"` |
| `upper(str)` | Convert to uppercase | `upper("hello") == "HELLO"` |
| `lower(str)` | Convert to lowercase | `lower("HELLO") == "hello"` |
| `split(str, delim)` | Split into array | `split("a,b,c", ",") == ["a", "b", "c"]` |
| `split(str, delim, n)` | Split with limit | `split("a,b,c", ",", 2) == ["a", "b,c"]` |
| `splitAfter(str, delim)` | Split keeping delimiters | `splitAfter("a,b,c", ",") == ["a,", "b,", "c"]` |
| `replace(str, old, new)` | Replace all occurrences | `replace("hello world", "world", "there")` |
| `repeat(str, n)` | Repeat n times | `repeat("ab", 3) == "ababab"` |
| `indexOf(str, sub)` | First occurrence index (-1 if missing) | `indexOf("apple pie", "pie") == 6` |
| `lastIndexOf(str, sub)` | Last occurrence index (-1 if missing) | `lastIndexOf("abab", "ab") == 2` |
| `hasPrefix(str, prefix)` | Starts with prefix? | `hasPrefix("hello", "he") == true` |
| `hasSuffix(str, suffix)` | Ends with suffix? | `hasSuffix("hello", "lo") == true` |

---

## Number

| Function | Description | Example |
| -------- | ----------- | ------- |
| `max(a, b)` | Larger of two numbers | `max(5, 7) == 7` |
| `min(a, b)` | Smaller of two numbers | `min(5, 7) == 5` |
| `abs(n)` | Absolute value | `abs(-5) == 5` |
| `ceil(n)` | Round up | `ceil(1.2) == 2.0` |
| `floor(n)` | Round down | `floor(1.8) == 1.0` |
| `round(n)` | Round to nearest integer | `round(1.5) == 2.0` |

---

## Array

Array functions that accept a predicate use `#` for the current element. See [Closures](/concepts/expressions#closures-).

| Function | Description | Example |
| -------- | ----------- | ------- |
| `all(arr, pred)` | True if all elements match | `all([1, 2, 3], # > 0) == true` |
| `any(arr, pred)` | True if any element matches | `any([1, 2, 3], # > 2) == true` |
| `one(arr, pred)` | True if exactly one matches | `one([1, 2, 3], # == 2) == true` |
| `none(arr, pred)` | True if no elements match | `none([1, 2, 3], # > 5) == true` |
| `map(arr, pred)` | Transform each element | `map([1, 2, 3], # * 2) == [2, 4, 6]` |
| `filter(arr, pred)` | Keep matching elements | `filter([1, 2, 3], # > 1) == [2, 3]` |
| `find(arr, pred)` | First matching element | `find([1, 2, 3], # > 1) == 2` |
| `findIndex(arr, pred)` | Index of first match | `findIndex([1, 2, 3], # > 1) == 1` |
| `findLast(arr, pred)` | Last matching element | `findLast([1, 2, 3], # > 1) == 3` |
| `findLastIndex(arr, pred)` | Index of last match | `findLastIndex([1, 2, 3], # > 1) == 2` |
| `groupBy(arr, pred)` | Group elements by key | `groupBy(users, #.role)` |
| `count(arr, pred)` | Count matching elements | `count([1, 2, 3], # > 1) == 2` |
| `reduce(arr, pred, init)` | Reduce to single value (`#acc` + `#`) | `reduce([1, 2, 3], #acc + #, 0) == 6` |
| `sum(arr)` | Sum of numbers | `sum([1, 2, 3]) == 6` |
| `mean(arr)` | Average | `mean([1, 2, 3]) == 2.0` |
| `median(arr)` | Median value | `median([1, 2, 3]) == 2.0` |
| `first(arr)` | First element (nil if empty) | `first([1, 2, 3]) == 1` |
| `last(arr)` | Last element (nil if empty) | `last([1, 2, 3]) == 3` |
| `take(arr, n)` | First n elements | `take([1, 2, 3, 4], 2) == [1, 2]` |
| `reverse(arr)` | Reverse order | `reverse([1, 2, 3]) == [3, 2, 1]` |
| `sort(arr)` | Sort ascending | `sort([3, 1, 2]) == [1, 2, 3]` |
| `sort(arr, "desc")` | Sort descending | `sort([1, 2, 3], "desc") == [3, 2, 1]` |
| `sortBy(arr, pred)` | Sort by predicate | `sortBy(users, #.age, "desc")` |
| `concat(arr1, arr2, ...)` | Concatenate arrays | `concat([1, 2], [3, 4]) == [1, 2, 3, 4]` |
| `flatten(arr)` | Flatten nested arrays | `flatten([[1, 2], [3]]) == [1, 2, 3]` |
| `uniq(arr)` | Remove duplicates | `uniq([1, 2, 2, 3]) == [1, 2, 3]` |
| `join(arr, delim)` | Join into string | `join(["a", "b"], ",") == "a,b"` |

---

## Map

| Function | Description | Example |
| -------- | ----------- | ------- |
| `keys(map)` | Array of keys | `keys({a: 1, b: 2}) == ["a", "b"]` |
| `values(map)` | Array of values | `values({a: 1, b: 2}) == [1, 2]` |
| `toPairs(map)` | Map to key-value pairs | `toPairs({a: 1}) == [["a", 1]]` |
| `fromPairs(arr)` | Key-value pairs to map | `fromPairs([["a", 1]]) == {a: 1}` |

---

## Date and time

| Function | Description | Example |
| -------- | ----------- | ------- |
| `now()` | Current time (UTC) | `now().Year()` |
| `date(str)` | Parse a date string | `date("2024-08-14")` |
| `date(str, tz)` | Parse with timezone | `date("2024-08-14", "America/New_York")` |
| `date(unix)` | Parse a Unix timestamp | `date(1700000000)` |
| `duration(str)` | Parse a duration string | `duration("1h30m")` |
| `timezone(str)` | Get a timezone by name | `timezone("Europe/Zurich")` |

Duration units: `ns`, `us`, `ms`, `s`, `m`, `h`. Date strings are parsed as RFC 3339 or `YYYY-MM-DD`. Numeric timestamps are auto-detected as seconds, milliseconds, microseconds, or nanoseconds.

### Date methods

`now()` and `date()` return a time value with these chainable methods:

| Method | Returns | Example |
| ------ | ------- | ------- |
| `.Year()` | Year (e.g. 2024) | `now().Year()` |
| `.Month()` | Month (1-12) | `now().Month()` |
| `.Day()` | Day of month (1-31) | `now().Day()` |
| `.Hour()` | Hour (0-23) | `now().Hour()` |
| `.Minute()` | Minute (0-59) | `now().Minute()` |
| `.Second()` | Second (0-59) | `now().Second()` |
| `.Weekday()` | Day of week (0 = Sunday) | `now().Weekday()` |
| `.YearDay()` | Day of year (1-366) | `now().YearDay()` |
| `.Unix()` | Unix timestamp (seconds) | `now().Unix()` |
| `.UnixMilli()` | Unix timestamp (ms) | `now().UnixMilli()` |
| `.Format(layout)` | Format using Go layout | `now().Format("2006-01-02")` |
| `.Add(dur)` | Add a duration | `now().Add(duration("1h"))` |
| `.Sub(time)` | Duration between two times | `now().Sub(date("2024-01-01"))` |
| `.Before(time)` | True if before | `date("2024-01-01").Before(now())` |
| `.After(time)` | True if after | `now().After(date("2024-01-01"))` |
| `.In(tz)` | Convert to timezone | `now().In(timezone("US/Eastern"))` |
| `.UTC()` | Convert to UTC | `date("...").UTC()` |
| `.Round(dur)` | Round to nearest duration | `now().Round(duration("1h"))` |
| `.Truncate(dur)` | Truncate to duration | `now().Truncate(duration("24h"))` |
| `.IsZero()` | True if zero value | `date("...").IsZero()` |

### Duration methods

| Method | Returns | Example |
| ------ | ------- | ------- |
| `.Hours()` | Float hours | `duration("90m").Hours() == 1.5` |
| `.Minutes()` | Float minutes | `duration("1h").Minutes() == 60.0` |
| `.Seconds()` | Float seconds | `duration("1m30s").Seconds() == 90.0` |
| `.Milliseconds()` | Integer ms | `duration("1s").Milliseconds() == 1000` |
| `.Microseconds()` | Integer us | `duration("1ms").Microseconds() == 1000` |
| `.Nanoseconds()` | Integer ns | `duration("1us").Nanoseconds() == 1000` |

---

## Type and conversion

| Function | Description | Example |
| -------- | ----------- | ------- |
| `type(v)` | Type name as string | `type(42) == "int"` |
| `int(v)` | Convert to integer | `int("123") == 123` |
| `float(v)` | Convert to float | `float("1.5") == 1.5` |
| `string(v)` | Convert to string | `string(123) == "123"` |
| `toJSON(v)` | Serialize to JSON string | `toJSON({a: 1})` |
| `fromJSON(str)` | Parse JSON string | `fromJSON("{\"a\":1}")` |
| `toBase64(str)` | Base64 encode | `toBase64("hello")` |
| `fromBase64(str)` | Base64 decode | `fromBase64("aGVsbG8=") == "hello"` |
| `len(v)` | Length of string, array, or map | `len("hello") == 5` |
| `get(v, key)` | Safe index/key access (nil if missing) | `get([1, 2], 5) == nil` |

---

For the Expr language specification, see the [Expr documentation](https://expr-lang.org/docs/language-definition).
