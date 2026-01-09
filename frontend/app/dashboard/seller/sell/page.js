import SellItemForm from "@/components/forms/SellItemForm";
import SellerLayout from "@/components/layouts/SellerLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";

export default function SellItemPage() {
  return (
    <ProtectedLayout allowedRoles={["seller"]}>
      <SellerLayout>
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                List New Item
              </h2>
            </div>
          </div>
          <SellItemForm />
        </div>
      </SellerLayout>
    </ProtectedLayout>
  );
}
