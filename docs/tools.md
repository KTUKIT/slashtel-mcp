# Tool reference

Ten tools, all read-only. None of them charge money. eSIM and top-up prices are USD, fees included, live at call time.

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

## check_esim_status

For a traveller who already bought a Slashtel eSIM. Both values must match the same order.

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `email` | string | yes | Email address used at checkout |
| `iccid` | string | yes | The eSIM's ICCID, 18 to 22 digits, usually starting 89 (in the order email and in phone settings) |

Returns data used, data left, plan size, expiry, status (not yet installed, active, used up or expired) and whether automatic top-up is on.

## check_phone_compatibility

How the traveller can confirm their phone supports eSIM and is unlocked before buying, with steps for iPhone and Android.

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `brand` | string | no | Phone brand for brand-specific steps, e.g. `iPhone`, `Samsung`, `Google Pixel` |

## get_layover_esim

For a trip with a connection: eSIM plans that cover the transit hub's country and the destination (and an optional second stop) on one QR code, cheapest first. Covers Dubai, Doha, Istanbul, Abu Dhabi, Singapore and 38 more hubs.

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `via` | string | yes | Transit airport code or city, e.g. `DXB`, `Doha`, `IST` |
| `to` | string | yes | Destination country, ISO-2 code (`GB`, `IN`) or name |
| `via2` | string | no | Optional second transit airport code or city |

Returns the matching plans, cheapest first, with live prices in USD.

## get_flight_status

Live status of a flight by number for yesterday, today or tomorrow.

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `flight` | string | yes | Flight number with airline code, e.g. `EK3`, `BA 286`, `AI161` |
| `day` | `yesterday`, `today` or `tomorrow` | no | Local day at the departure airport. Default `today` |

Returns departure and arrival airports, scheduled and expected times, terminal, gate, baggage belt, whether it is in the air, its last reported position, and a slashtel.com link to follow it live and get a free email on delay and landing.

## get_flight_fares

Cheapest one-way fares by month from Slashtel's fare tracker: the next 12 months on tracked routes, the next 3 months on others. Slashtel does not sell flights; fares come from cached fare data in GBP and the airline sets the final price.

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `origin` | string | yes | IATA airport or city code, e.g. `LON`, `NYC`, `DXB` |
| `destination` | string | yes | IATA airport or city code, e.g. `DEL`, `MNL` |

Returns price, airline and stops per month, the cheapest month and a source link to cite.

## create_price_alert_link

A slashtel.com link that opens the free fare alert form with the route filled in. The traveller enters and confirms their own email; nothing is created until they confirm.

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `origin` | string | yes | IATA code, e.g. `LON` |
| `destination` | string | yes | IATA code, e.g. `DEL` |
| `origin_name` | string | no | City name, e.g. `London` |
| `destination_name` | string | no | City name, e.g. `Delhi` |
| `month` | string | no | Travel month, `YYYY-MM` |

Returns the alert link.

## Errors

If a tool returns an error, follow its message. Usually it means the plan or option has changed, so call the plans tool again.
