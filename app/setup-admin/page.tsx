 import SetupAdminForm from "@/components/setup-admin-form"

 export default function SetupAdminPage() {
   return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
       <SetupAdminForm />
     </div>
   )
 }
// import { createFirstAdmin } from "@/app/actions/auth"
// import { redirect } from "next/navigation"

// export default function SetupAdminPage() {
//   async function handleCreateAdmin(formData: FormData) {
//     "use server"

//     const email = formData.get("email") as string
//     const password = formData.get("password") as string
//     const name = formData.get("name") as string

//     const result = await createFirstAdmin(email, password, name)

//     if (result?.error) {
//       redirect(`/setup-admin?error=${encodeURIComponent(result.error)}`)
//     }

//     // ✅ BERHASIL
//     redirect("/login?admin=success")
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <form action={handleCreateAdmin} className="space-y-4 w-[360px]">
//         <h1 className="text-xl font-bold text-center">Setup Admin Pertama</h1>

//         <input
//           name="name"
//           placeholder="Nama Admin"
//           required
//           className="w-full border p-2 rounded"
//         />
//         <input
//           name="email"
//           type="email"
//           placeholder="Email Admin"
//           required
//           className="w-full border p-2 rounded"
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           required
//           className="w-full border p-2 rounded"
//         />

//         <button className="w-full bg-black text-white p-2 rounded">
//           Buat Admin
//         </button>
//       </form>
//     </div>
//   )
// }
