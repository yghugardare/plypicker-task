
// import Link from "next/link"
// import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
// import { Button } from "@/components/ui/button"
// import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"

// export function DashBoardAdd() {
//   return (
//     <div className="flex min-h-screen w-full">
//       <aside className="hidden w-64 flex-col border-r bg-background p-6 md:flex">
//         <div className="mb-8 flex items-center gap-2">
//           {/* <Package2Icon className="h-6 w-6" /> */}
//           <h1 className="text-xl font-bold">Admin Dashboard</h1>
//         </div>
//         <nav className="flex flex-col gap-2">
//           <Link
//             href="#"
//             className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
//             prefetch={false}
//           >
//             {/* <InboxIcon className="h-5 w-5" /> */}
//             Requests
//           </Link>
//           <Link
//             href="#"
//             className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
//             prefetch={false}
//           >
//             {/* <PlusIcon className="h-5 w-5" /> */}
//             Add Product
//           </Link>
//           <Link
//             href="#"
//             className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
//             prefetch={false}
//           >
//             {/* <FilePenIcon className="h-5 w-5" /> */}
//             Edit Products
//           </Link>
//           <Link
//             href="#"
//             className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
//             prefetch={false}
//           >
//             {/* <CircleCheckIcon className="h-5 w-5" /> */}
//             Review Requests
//           </Link>
//         </nav>
//       </aside>
//       <div className="flex-1">
//         <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button size="icon" variant="outline" className="md:hidden">
//                 {/* <MenuIcon className="h-5 w-5" /> */}
//                 <span className="sr-only">Toggle Menu</span>
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="left" className="md:hidden">
//               <div className="grid gap-4 p-4">
//                 <Link
//                   href="#"
//                   className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
//                   prefetch={false}
//                 >
//                   {/* <InboxIcon className="h-5 w-5" /> */}
//                   Requests
//                 </Link>
//                 <Link
//                   href="#"
//                   className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
//                   prefetch={false}
//                 >
//                   {/* <PlusIcon className="h-5 w-5" /> */}
//                   Add Product
//                 </Link>
//                 <Link
//                   href="#"
//                   className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
//                   prefetch={false}
//                 >
//                   {/* <FilePenIcon className="h-5 w-5" /> */}
//                   Edit Products
//                 </Link>
//                 <Link
//                   href="#"
//                   className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
//                   prefetch={false}
//                 >
//                   {/* <CircleCheckIcon className="h-5 w-5" /> */}
//                   Review Requests
//                 </Link>
//               </div>
//             </SheetContent>
//           </Sheet>
//           <Breadcrumb className="hidden md:flex">
//             <BreadcrumbList>
//               <BreadcrumbItem>
//                 <BreadcrumbLink asChild>
//                   <Link href="#" prefetch={false}>
//                     Dashboard
//                   </Link>
//                 </BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem>
//                 <BreadcrumbPage>Add Product</BreadcrumbPage>
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild />
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>My Account</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>Settings</DropdownMenuItem>
//               <DropdownMenuItem>Support</DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>Logout</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </header>
//         <main className="grid md:grid-cols-2 gap-8 p-4 md:p-6">
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Product Image</h2>
//             <div className="flex flex-col justify-center items-center gap-4">
//               <div className="aspect-square h-[325px] w-full bg-muted rounded-md overflow-hidden">
//                 <img
//                   src="/placeholder.svg"
//                   alt="Product Image"
//                   width={300}
//                   height={300}
//                   className="w-full h-full object-cover"
//                   style={{ aspectRatio: "300/300", objectFit: "cover" }}
//                 />
//               </div>
//               <div className="flex items-center gap-x-10">
//                 <Button variant="outline" className="w-full">
//                   <UploadIcon className="w-5 h-5 mr-2" />
//                   Upload Image
//                 </Button>
//                 <Button variant="outline" className="w-full">
//                   <CropIcon className="w-5 h-5 mr-2" />
//                   Crop Image
//                 </Button>
//               </div>
//             </div>
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
//             <form className="grid gap-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="name">Product Name</Label>
//                 <Input id="name" type="text" placeholder="Enter product name" />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="price">Product Price</Label>
//                 <Input id="price" type="number" placeholder="Enter product price" />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="description">Product Description</Label>
//                 <Textarea id="description" rows={4} placeholder="Enter product description" />
//               </div>
//               <Button type="submit" className="justify-self-end">
//                 Add Product
//               </Button>
//             </form>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// // function CircleCheckIcon(props) {
// //   return (
// //     <svg
// //       {...props}
// //       xmlns="http://www.w3.org/2000/svg"
// //       width="24"
// //       height="24"
// //       viewBox="0 0 24 24"
// //       fill="none"
// //       stroke="currentColor"
// //       strokeWidth="2"
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //     >
// //       <circle cx="12" cy="12" r="10" />
// //       <path d="m9 12 2 2 4-4" />
// //     </svg>
// //   )
// // }


// // function CropIcon(props) {
// //   return (
// //     <svg
// //       {...props}
// //       xmlns="http://www.w3.org/2000/svg"
// //       width="24"
// //       height="24"
// //       viewBox="0 0 24 24"
// //       fill="none"
// //       stroke="currentColor"
// //       strokeWidth="2"
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //     >
// //       <path d="M6 2v14a2 2 0 0 0 2 2h14" />
// //       <path d="M18 22V8a2 2 0 0 0-2-2H2" />
// //     </svg>
// //   )
// // }


// // function FilePenIcon(props) {
// //   return (
// //     <svg
// //       {...props}
// //       xmlns="http://www.w3.org/2000/svg"
// //       width="24"
// //       height="24"
// //       viewBox="0 0 24 24"
// //       fill="none"
// //       stroke="currentColor"
// //       strokeWidth="2"
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //     >
// //       <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
// //       <path d="M14 2v4a2 2 0 0 0 2 2h4" />
// //       <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
// //     </svg>
// //   )
// // }


// // function InboxIcon(props) {
// //   return (
// //     <svg
// //       {...props}
// //       xmlns="http://www.w3.org/2000/svg"
// //       width="24"
// //       height="24"
// //       viewBox="0 0 24 24"
// //       fill="none"
// //       stroke="currentColor"
// //       strokeWidth="2"
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //     >
// //       <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
// //       <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
// //     </svg>
// //   )
// // }


// // function MenuIcon(props) {
// //   return (
// //     <svg
// //       {...props}
// //       xmlns="http://www.w3.org/2000/svg"
// //       width="24"
// //       height="24"
// //       viewBox="0 0 24 24"
// //       fill="none"
// //       stroke="currentColor"
// //       strokeWidth="2"
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //     >
// //       <line x1="4" x2="20" y1="12" y2="12" />
// //       <line x1="4" x2="20" y1="6" y2="6" />
// //       <line x1="4" x2="20" y1="18" y2="18" />
// //     </svg>
// //   )
// // }


// // function Package2Icon(props) {
// //   return (
// //     <svg
// //       {...props}
// //       xmlns="http://www.w3.org/2000/svg"
// //       width="24"
// //       height="24"
// //       viewBox="0 0 24 24"
// //       fill="none"
// //       stroke="currentColor"
// //       strokeWidth="2"
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //     >
// //       <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
// //       <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
// //       <path d="M12 3v6" />
// //     </svg>
// //   )
// // }


// // function PlusIcon(props) {
// //   return (
// //     <svg
// //       {...props}
// //       xmlns="http://www.w3.org/2000/svg"
// //       width="24"
// //       height="24"
// //       viewBox="0 0 24 24"
// //       fill="none"
// //       stroke="currentColor"
// //       strokeWidth="2"
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //     >
// //       <path d="M5 12h14" />
// //       <path d="M12 5v14" />
// //     </svg>
// //   )
// // }


// // function UploadIcon(props) {
// //   return (
// //     <svg
// //       {...props}
// //       xmlns="http://www.w3.org/2000/svg"
// //       width="24"
// //       height="24"
// //       viewBox="0 0 24 24"
// //       fill="none"
// //       stroke="currentColor"
// //       strokeWidth="2"
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //     >
// //       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
// //       <polyline points="17 8 12 3 7 8" />
// //       <line x1="12" x2="12" y1="3" y2="15" />
// //     </svg>
// //   )
// // }
