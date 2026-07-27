import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/RouteGuard'
import { AboutPage } from '../pages/AboutPage'
import { AccessibilityPage } from '../pages/AccessibilityPage'
import { BlogArticlePage } from '../pages/BlogArticlePage'
import { BlogPage } from '../pages/BlogPage'
import { CareersPage } from '../pages/CareersPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { ContactPage } from '../pages/ContactPage'
import { CuisinesPage } from '../pages/CuisinesPage'
import { FaqPage } from '../pages/FaqPage'
import { FoodDetailPage } from '../pages/FoodDetailPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { GiftCardsPage } from '../pages/GiftCardsPage'
import { HelpCenterPage } from '../pages/HelpCenterPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { MealPlannerPage } from '../pages/MealPlannerPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { NotificationsPage } from '../pages/NotificationsPage'
import { NutritionFinderPage } from '../pages/NutritionFinderPage'
import { OrderDetailPage } from '../pages/OrderDetailPage'
import { OrderHistoryPage } from '../pages/OrderHistoryPage'
import { PartnerWithUsPage } from '../pages/PartnerWithUsPage'
import { PopularRestaurantsPage } from '../pages/PopularRestaurantsPage'
import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage'
import { ProfilePage } from '../pages/ProfilePage'
import { RecentlyViewedPage } from '../pages/RecentlyViewedPage'
import { ReferralProgramPage } from '../pages/ReferralProgramPage'
import { RefundPolicyPage } from '../pages/RefundPolicyPage'
import { RegisterPage } from '../pages/RegisterPage'
import { ResetPasswordPage } from '../pages/ResetPasswordPage'
import { RestaurantDetailPage } from '../pages/RestaurantDetailPage'
import { RestaurantListPage } from '../pages/RestaurantListPage'
import { RewardsPage } from '../pages/RewardsPage'
import { SavedAddressesPage } from '../pages/SavedAddressesPage'
import { SearchPage } from '../pages/SearchPage'
import { SettingsPage } from '../pages/SettingsPage'
import { TermsPage } from '../pages/TermsPage'
import { TrendingFoodsPage } from '../pages/TrendingFoodsPage'
import { VerifyEmailPage } from '../pages/VerifyEmailPage'
import { WishlistPage } from '../pages/WishlistPage'
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage'
import { AdminCouponsPage } from '../pages/admin/AdminCouponsPage'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage'
import { AdminRestaurantsPage } from '../pages/admin/AdminRestaurantsPage'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage'
import { RestaurantCategoriesPage } from '../pages/restaurant-admin/RestaurantCategoriesPage'
import { RestaurantCouponsPage } from '../pages/restaurant-admin/RestaurantCouponsPage'
import { RestaurantDashboardPage } from '../pages/restaurant-admin/RestaurantDashboardPage'
import { RestaurantFoodsPage } from '../pages/restaurant-admin/RestaurantFoodsPage'
import { RestaurantOrdersPage } from '../pages/restaurant-admin/RestaurantOrdersPage'
import { RestaurantSettingsPage } from '../pages/restaurant-admin/RestaurantSettingsPage'
import { AdminLayout } from './AdminLayout'
import { AuthLayout } from './AuthLayout'
import { RestaurantAdminLayout } from './RestaurantAdminLayout'
import { RootLayout } from './RootLayout'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurants" element={<RestaurantListPage />} />
        <Route path="/restaurants/:slug" element={<RestaurantDetailPage />} />
        <Route path="/restaurants/:slug/food/:foodId" element={<FoodDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/nutrition-finder" element={<NutritionFinderPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/trending" element={<TrendingFoodsPage />} />
        <Route path="/popular-restaurants" element={<PopularRestaurantsPage />} />
        <Route path="/recently-viewed" element={<RecentlyViewedPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogArticlePage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
        <Route path="/partner-with-us" element={<PartnerWithUsPage />} />
        <Route path="/cuisines" element={<CuisinesPage />} />
        <Route path="/gift-cards" element={<GiftCardsPage />} />
        <Route path="/referral" element={<ReferralProgramPage />} />
        <Route path="/careers" element={<CareersPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/meal-planner" element={<MealPlannerPage />} />
          <Route path="/addresses" element={<SavedAddressesPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/restaurants" element={<AdminRestaurantsPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/coupons" element={<AdminCouponsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['restaurant_owner']} />}>
          <Route element={<RestaurantAdminLayout />}>
            <Route path="/restaurant-admin" element={<RestaurantDashboardPage />} />
            <Route path="/restaurant-admin/foods" element={<RestaurantFoodsPage />} />
            <Route path="/restaurant-admin/categories" element={<RestaurantCategoriesPage />} />
            <Route path="/restaurant-admin/coupons" element={<RestaurantCouponsPage />} />
            <Route path="/restaurant-admin/orders" element={<RestaurantOrdersPage />} />
            <Route path="/restaurant-admin/settings" element={<RestaurantSettingsPage />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
