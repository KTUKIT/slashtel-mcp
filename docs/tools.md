# Tool reference

All tools are read-only. None of them charge money. Prices are USD, fees included, live at call time.

## list_esim_destinations

Countries and regions Slashtel sells travel eSIMs for.

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `search` | string | no | Part of a country or region name, e.g. `turk` or `europe` |

Returns each destination's code, name, lowest live price in USD and number of plans.

## get_esim_plans

Live plans for one destination.

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `destination` | string | yes | ISO-2 country code (`TR`, `JP`, `US`, `GB`) or a destination code from `list_esim_destinations` |
| `min_gb` | number | no | Minimum data in GB |
| `min_days` | number | no | Minimum validity in days |

Each plan has `plan_id`, `data_gb`, `days`, `price_usd` and `usd_per_gb`.

## get_topup_plans

Detects the operator of a mobile number and returns the live top-up options.

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `phone` | string | yes | Full international number with country code, e.g. `+911234567890` |

Returns `operator_code`, operator name and `options`, each with `send_value`, what the recipient `receives`, `validity_days` where it applies, and `price_usd`.

## create_checkout_link

Returns a slashtel.com link with the chosen item selected. The user enters their email and pays on the site.

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `type` | `esim` or `topup` | yes | |
| `plan_id` | string | for `esim` | From `get_esim_plans` |
| `phone` | string | for `topup` | Full international number |
| `operator_code` | string | for `topup` | From `get_topup_plans` |
| `send_value` | number | for `topup` | From `get_topup_plans` |

Returns `checkout_url`.

## Errors

If a tool returns an error, follow its message. Usually it means the plan or option has changed, so call the plans tool again.
