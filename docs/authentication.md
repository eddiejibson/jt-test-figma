# Authentication

### 1. Setup

```
VITE_APP_CLIENT_ID=''
VITE_APP_CLIENT_SECRET=''
```

### 4. Check authentication info

By default authentication info will be stored to localstorage. Use below information to access data

```javascript
import { useAuthenticationData } from '@services/authentication'

const authData = useAuthenticationData()
```

Or you can get anywhere

```javascript
import authenticationSession from '@utils/authenticationSession'

const authenticationInfo = authenticationSession.getAuthenticationInfo()
```