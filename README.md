## Getting Started

Install packages
```bash
yarn install
```

Config .env for authentication: the information get from our exported API project
```
VITE_APP_CLIENT_ID=''
VITE_APP_CLIENT_SECRET=''
```

Run on your local
```bash
npm run dev
# or
yarn dev
```

Buil production
```bash
yarn build
```

## Structure

```
src
   → assets (not sure but the bridge to get assets ⇒ import { assets } from ‘@asses/index’ ⇒ assets(’name of asset’)
   → pages
   → components
       → atoms
       → molecules
           → AppButton
               → AppButton
               → AppButton.style
       → organisms
   → constants
   → pages
      → Home
          → Home
          → Home.style (generate style code here)
   → models
   → states
   → services
   → utils
```

## Guildeline

### 1. Navigation

For client side, supported navigation function over services/navigate
```javascript
import { useNavigateService } from '@services/navigate'

const navigation = useNavigateService()
navigation.push()
navigation.replace()
navigation.goBack()
navigation.reload()
```

### 2. Service
Service support function based on business model

How to use service for fetch data from client side
```javascript
// Define state for query params
const [filterPostParams, setFilterPostParams] = useState<Partial<FilterPostRequestBody>>({
  pagination_page: props.query?.page_number,
  pagination_limit: props.query?.page_limit
})

// Define query service and pass params to it.
const filterPostQuery = useFilterPostQuery(filterPostParams)
// State of Query can be get over "filterPostQuery"
// filterPostQuery.loading
// filterPostQuery.error
// filterPostQuery.data


// Define action for queries change to trigger refetch data if needed
const handleQueryChange = (newQuery: Partial<FilterPostRequestBody>) => {
  setFilterPostParams(newQuery)
}

```


How to use service for mutation data
```javascript
// Define mutation service
const createPostMutation = useCreatePostMutation();

// Call mutation
const handleCreatePost = async (data: PostData) => {
  try {
    const response = await createPostMutation.mutateAsync(data);
  } catch (e: unknown) {}
};
// State of mutation can be get over "createPostMutation"
// createPostMutation.loading
// createPostMutation.error
// createPostMutation.data
```

### 3. Form
Define a hook with yup schema and react-hook-form outside component

```javascript
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const useLoginForm = () => {
  const validationScheme = useMemo(
    () =>
      yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required()
      }),
    []
  )
  return useForm<Form1FormData>({
    resolver: yupResolver(validationScheme),
    shouldFocusError: true,
    mode: 'onChange',
    reValidateMode: 'onChange'
  })
}
```

Use hook inside component

```javascript
const { register, handleSubmit, errors, control } = useLoginForm()
```

### 4. Basic HTTP Authentication

Vite project is build for serverless, and host as static resources. So there are some solutions:
+ Setup basic-auth by Azure Static Web Apps
+ If static resources hosted under Nestjs application
```typescript
ServeStaticModule.forRootAsync({
  useFactory: (configService: ConfigService) => {
    return [
      {
        rootPath: join(__dirname, '..', '..', './dist'),
        exclude: ['/api/(.*)'],
        serveStaticOptions: {
          setHeaders: (res) => {
            const setCspHeaders = () => {
              res.setHeader('Cross-Origin-Embedder-Policy', 'same-origin');
            };
            const basicAuth = res?.req?.headers?.authorization;
            const basicAuthUsername =
              configService.get('basicAuth.username');
            const basicAuthPassword =
              configService.get('basicAuth.password');
            if (!basicAuthUsername && !basicAuthPassword) {
              setCspHeaders();
              return;
            }
            if (basicAuth) {
              const authValue = basicAuth.split(' ')[1];
              const [user, pwd] = atob(authValue).split(':');

              if (user === basicAuthUsername && pwd === basicAuthPassword) {
                setCspHeaders();
                return;
              }
            }
            res.setHeader('WWW-authenticate', 'Basic realm="Secure Area"');
            res.statusCode = 401;
          },
        },
      },
    ];
  },
  inject: [ConfigService],
})
```

## Deployment

## Environment Variable

| Key                                | Data Type | Example Value                                 | Description                                                                 |
|------------------------------------|-----------|-----------------------------------------------|-----------------------------------------------------------------------------|
| VITE_ACCESS_TOKEN_THRESHOLD | number    | 120000                                        | How long access token will be expired in milliseconds.                      |
| VITE_APP_CLIENT_ID                      | string    | randomstring                                  | Obtained from backend configuration.                                        |
| VITE_APP_CLIENT_SECRET                  | string    | randomstring                                  | Obtained from backend configuration.                                        |
| VITE_API_URL                | string    | https://xxx.jitera.com      | API URL                                                                     |