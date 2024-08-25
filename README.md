This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### State Persistance issue
### Documentation: Understanding and Solving Hydration Issues in Next.js 14

#### **What is Hydration in Next.js?**

**Hydration** is the process by which Next.js takes the static HTML content that was pre-rendered on the server and converts it into a fully interactive React application on the client side. During hydration, React attaches event handlers and reconciles the static HTML with the dynamic state-driven components.

This process is crucial because it ensures that the initial page load is fast (thanks to server-side rendering) while still allowing the page to become interactive with React once it reaches the client. However, for hydration to work smoothly, the HTML generated on the server must exactly match what React expects on the client. If there’s any discrepancy, such as differences in state or content based on client-only data like `localStorage`, it can lead to a **hydration error** or brief incorrect rendering.

#### **Issue Description**

The issue I faced was as follows:
- **Correct Rendering After Login:** Initially, after logging in, the `NavBar` showed the correct content because I had an effect in `app/page.tsx` that fetched the user data from `localStorage`.
- **Incorrect Rendering on Route Changes or Page Refresh:** However, when navigating to other routes or refreshing the page on routes other than the root `/`, the `NavBar` would briefly display the wrong content. It appeared as if the user was not logged in, even though they were. After about 0.5 to 1 second, the `NavBar` would update and show the correct content.

This brief period of incorrect content was due to the delay between the initial server-rendered HTML and the client-side JavaScript that fetched and updated the user state.

#### **Cause of the Issue**

The issue was caused by the way Next.js handles server-side rendering (SSR) and client-side hydration:
- **Server-Side Rendering:** When the page is initially rendered on the server, it doesn’t have access to `localStorage` or other client-only APIs. As a result, the HTML sent to the client reflects a state that might not match the actual state on the client.
- **Client-Side Hydration:** Once the page reaches the client, React hydrates the HTML by attaching event handlers and updating the state. However, if there’s a delay in fetching the client-side data (e.g., from `localStorage`), the UI might briefly display outdated or incorrect content.

In my case, the `NavBar` was rendered with server-side HTML that didn’t have the user information from `localStorage`. Once the page was hydrated and the `useEffect` hook ran, the `NavBar` updated to reflect the correct user state. This caused the brief flicker of incorrect content.

#### **Solution**

To solve this issue, I made the following adjustments:

1. **Use `useEffect` for Client-Side Logic:**
   I added a `useEffect` hook in the `NavBar` component to ensure that the user state is rehydrated from `localStorage` on the client side. This ensured that the `NavBar` would always display the correct content after hydration.

   ```javascript
   useEffect(() => {
    // fetch user functionality
     const storedUser = localStorage.getItem("logedin-user");
     if (storedUser) {
       setUser(JSON.parse(storedUser));
     }
   }, [setUser]);
   ```

2. **Rehydration and State Synchronization:**
   By using `useEffect`, I ensured that the client-side state was always synchronized with what was stored in `localStorage`. This minimized the chances of displaying incorrect content during the brief hydration period.

3. **Brief Incorrect Display:**
   While the `useEffect` approach solved the main issue, there might still be a brief moment where the wrong content is displayed. This is because the server-rendered HTML is used until the client-side JavaScript updates the state. However, this flicker is now much shorter and less noticeable.


For more information on hydration issues and how to resolve them, you can refer to the following resources:
- [Next.js Documentation on Hydration Errors](https://nextjs.org/docs/messages/react-hydration-error)
- [Fixing Hydration Issues in Next.js](https://brockherion.dev/blog/posts/nextjs-fixing-hydration-issues-with-zustand)【16†source】
- [Handling Hydration in Next.js](https://nextjsstarter.com/blog/hydration-errors)【15†source】.
