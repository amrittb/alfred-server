# Alfred
Butler for smart homes.

### Webhook for Messenger

The webhook for the messenger is in **/messenger** path.

### API for Arduino

The API path for Arduino is in **/actions** path. The data needed to be sent in this path are:

```json
{
  "facebook_user_id": FACEBOOK_USER_ID,
  "actions_after": DATE_TIME_AFTER_WHICH_THE_ACTION_IS_TO_BE_FETCHED
}
```