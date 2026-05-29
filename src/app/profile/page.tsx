import UpdateButton from "@/components/UpdateButton";
import { updateUser } from "@/lib/actions";
import { wixClientServer } from "@/lib/wixClientServer";
import { members } from "@wix/members";
import Link from "next/link";
import { format } from "timeago.js";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

const ProfilePage = async () => {
  const wixClient = await wixClientServer();

  const user = await wixClient.members.getCurrentMember({
    fieldsets: [members.Set.FULL],
  });

  if (!user.member?.contactId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Not Logged In</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Please log in to view your profile and orders.</p>
          <Link
            href="/login"
            className="inline-block bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  const orderRes = await wixClient.orders.searchOrders({
    search: {
      filter: { "buyerInfo.contactId": { $eq: user.member?.contactId } },
    },
  });

  const initials = `${(user.member?.contact?.firstName || "U")[0]}${(user.member?.contact?.lastName || "")[0] || ""}`.toUpperCase();
  const memberSince = user.member?._createdDate ? new Date(user.member._createdDate).toLocaleDateString("en-IN", { year: "numeric", month: "long" }) : "Recently";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8">

        {/* Profile Header Banner */}
        <div className="relative mb-8 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-600 to-indigo-600 dark:from-primary-900 dark:via-primary-800 dark:to-indigo-900"></div>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
          <div className="relative px-6 md:px-10 py-8 md:py-12 flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg">
              {initials}
            </div>
            {/* User Info */}
            <div className="text-center md:text-left text-white">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {user.member?.contact?.firstName || user.member?.profile?.nickname || "User"}{" "}
                {user.member?.contact?.lastName || ""}
              </h1>
              <p className="text-white/80 mt-1 text-sm md:text-base">{user.member?.loginEmail}</p>
              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-3">
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white/90 text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/></svg>
                  Member since {memberSince}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white/90 text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"/><path fillRule="evenodd" d="M6 18a2 2 0 100-4 2 2 0 000 4zm9-2a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd"/></svg>
                  {orderRes.orders.length} order{orderRes.orders.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Profile Form - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Edit Profile
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update your personal information</p>
              </div>
              <form action={updateUser} className="p-6 flex flex-col gap-5">
                <input type="text" hidden name="id" value={user.member.contactId} />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                    </span>
                    <input
                      type="text"
                      name="username"
                      placeholder={user.member?.profile?.nickname || "john"}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder={user.member?.contact?.firstName || "John"}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Surname</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder={user.member?.contact?.lastName || "Doe"}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </span>
                    <input
                      type="text"
                      name="phone"
                      placeholder={
                        (user.member?.contact?.phones &&
                          user.member?.contact?.phones[0]) ||
                        "+91 98765 43210"
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">E-mail</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </span>
                    <input
                      type="email"
                      name="email"
                      placeholder={user.member?.loginEmail || "john@gmail.com"}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <UpdateButton />
              </form>
            </div>
          </div>

          {/* Orders - Right Column */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                  Order History
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track and manage your past purchases</p>
              </div>

              {orderRes.orders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-5xl mb-4">📭</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Orders Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                    You haven&apos;t placed any orders yet. Start shopping to see them here!
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2.5 px-6 rounded-lg transition-colors"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div>
                  {/* Table Header */}
                  <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-700/50 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    <div className="col-span-3">Order ID</div>
                    <div className="col-span-3">Amount</div>
                    <div className="col-span-3">Date</div>
                    <div className="col-span-3">Status</div>
                  </div>

                  {/* Order Rows */}
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {orderRes.orders.map((order) => {
                      const status = String(order.status || "");
                      const statusColor =
                        status === "FULFILLED" || status === "PAID"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : status === "CANCELED" || status === "REFUNDED"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";

                      return (
                        <Link
                          href={`/orders/${order._id}`}
                          key={order._id}
                          className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors group"
                        >
                          <div className="sm:col-span-3 flex items-center gap-2">
                            <span className="sm:hidden text-xs font-medium text-gray-500 dark:text-gray-400 w-16">Order:</span>
                            <span className="font-mono text-sm text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              #{order._id?.substring(0, 10)}
                            </span>
                          </div>
                          <div className="sm:col-span-3 flex items-center gap-2">
                            <span className="sm:hidden text-xs font-medium text-gray-500 dark:text-gray-400 w-16">Amount:</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              ₹{order.priceSummary?.subtotal?.amount}
                            </span>
                          </div>
                          <div className="sm:col-span-3 flex items-center gap-2">
                            <span className="sm:hidden text-xs font-medium text-gray-500 dark:text-gray-400 w-16">Date:</span>
                            {order._createdDate && (
                              <span className="text-sm text-gray-600 dark:text-gray-400">{format(order._createdDate)}</span>
                            )}
                          </div>
                          <div className="sm:col-span-3 flex items-center gap-2">
                            <span className="sm:hidden text-xs font-medium text-gray-500 dark:text-gray-400 w-16">Status:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>
                              {order.status}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
