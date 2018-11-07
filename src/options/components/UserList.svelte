<h2>Users</h2>
<table id="user-list" class="user-list">
  <tbody>
    { #each sortedUsers as [userId, value], index }
      <tr>
        <td>
          <button class="delete icon-hover" on:click="removeAccount(index)">
            <i class="fa fa-times fa-2x" aria-hidden="true"></i>
          </button>
        </td>
        <td>{ value.screenName }</td>
      </tr>
    { /each }
    <tr>
      <td>
        <button class="{ buttonAvailable ? 'icon-hover' : '' }" disabled="{ !buttonAvailable }" on:click="addAccount()">
          <i class="fa fa-plus fa-2x"></i>
        </button>
      </td>
    </tr>
  </tbody>
</table>

<style>
  button {
    background-color: transparent;
    border: none;
    outline: none;
    padding: 0;
  }

  h2 {
    margin-top: 20px;
    margin-bottom: 0;
    margin-left: 10px;
    padding-left: 5px;
  }

  .user-list {
    border-spacing: 0;
    margin: 10px;
  }

  .user-list td {
    padding: 5px;
  }

  .user-list td:first-child {
    text-align: center;
  }

  .icon-hover:hover {
    color: red;
    cursor: pointer;
  }
</style>

<script>
  import * as Chrome from '../../utils/chrome/index'

  export default {
    data() {
      return {
        buttonAvailable: true,
      }
    },

    computed: {
      sortedUsers({ users }) {
        return Object.entries(users).filter(([k, ]) => k !== 'currentUserId').sort(([, v], [, v2]) => v.orderBy - v2.orderBy)
      }
    },

    methods: {
      async addAccount() {
        this.set({
          buttonAvailable: false,
        })

        await Chrome.Runtime.sendMessage({
          type: 'AddAccount',
        })
      },

      async removeAccount(index) {
        const { users } = this.get()
        delete users[this.get().sortedUsers[index][0]]

        this.set({
          users
        })

        await Chrome.Runtime.sendMessage({
          type: 'RemoveAccount',
          data: {
            users
          }
        })
      },
    },
  }
</script>
