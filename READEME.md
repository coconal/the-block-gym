### 1. 安装依赖

本项目分为三个子项目
前端:

```bash
cd gym-frontend
npm install
```

后端:

```bash
cd gym-backend
npm install
```

智能合约:

```bash
cd gym-contract
npm install
```

### 2. 启动项目

前端:

```bash
cd gym-frontend
npm run dev
```

或者(建议)

```bash
cd gym-frontend
npm run build
npm run start
```

后端:

```bash
cd gym-backend
npm start
```

智能合约:

```bash
cd contract
npx hardhat node
npm run init
```

### 3. 访问项目

项目启动后

URL_ADDRESS 前端: http://localhost:3000/

后端: http://localhost:3002/

访问合约: http://localhost:8545/

### 4. 项目结构

gym-frontend: 前端项目

```bash
├─.env
├─.gitignore
├─de.ts
├─eslint.config.mjs
├─next-env.d.ts
├─next.config.ts
├─package-lock.json
├─package.json
├─README.md
├─tsconfig.json
├─wagmi.ts
├─public
├─contract (智能合约ABI)
|    └gymMembership.ts
├─app
|  ├─globals.css
|  ├─icon.png
|  ├─layout.tsx
|  ├─loading.tsx
|  ├─page.tsx
|  ├─providers.tsx
|  ├─_utils
|  ├─_store (状态管理)
|  |   ├─index.tsx
|  |   ├─modules
|  |   |    └bookingStore.ts
|  ├─_requestAPI (API)
|  |      ├─entity
|  |      |   ├─course.d.ts
|  |      |   ├─schedule.d.ts
|  |      |   ├─user.d.ts
|  |      |   └usermembership.d.ts
|  |      ├─API
|  |      |  ├─courses.ts
|  |      |  ├─membership.ts
|  |      |  ├─schedule.ts
|  |      |  └user.ts
|  ├─_module
|  |    └gym.d.ts
|  ├─_components
|  ├─location
|  ├─hooks
|  |   ├─useGetUser.ts
|  |   └useUserMembership.ts
|  ├─dashboard
|  |     ├─layout.tsx
|  |     ├─loading.tsx
|  |     ├─page.tsx
|  |     ├─settings
|  |     ├─schedule
|  |     ├─release
|  |     ├─manageuser
|  |     ├─managecourse
|  |     ├─general
|  |     ├─check
|  |     ├─booking
|  ├─auth
|  ├─about
```

gym-backend: 后端项目

```bash
├─.env
├─.gitignore
├─package-lock.json
├─package.json
├─src
|  ├─app.js
|  ├─utils
|  ├─scripts fake数据脚本
|  ├─routes 路由
|  ├─model  数据库模型
|  ├─controller 控制器
|  ├─contract 智能合约ABI
```

gym-contract: 智能合约项目

```bash
├─.gitignore
├─hardhat.config.js
├─package-lock.json
├─package.json
├─README.md
├─test 测试
|  └GymMembershipTest.js
├─scripts 脚本
|    └seed.js
├─contracts 智能合约
```
