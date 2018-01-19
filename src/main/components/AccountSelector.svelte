Logged in:
<span id="user-name" class="user-name">@{{ $users[$current_user_id].screenName }}</span>
<input type="hidden" id="user-id" value="{{ $current_user_id }}">

<style>
  .user-name {
    font-weight: bold;
  }
</style>
