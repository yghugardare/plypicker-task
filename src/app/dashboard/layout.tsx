import MobileSideBar from "@/components/component/mobile-side-bar";
import SideBar from "@/components/component/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[92vh] w-full mt-2 justify-center md:gap-x-5">
      <SideBar />
      <div className="flex-1">
        <MobileSideBar />
        {children}
      </div>
    </div>
  );
}
