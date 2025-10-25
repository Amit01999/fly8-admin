import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/services/authAPI';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Mail,
  Phone,
  Shield,
  Camera,
  Save,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Edit,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function MyProfile() {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  // State for edit mode
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    image: user?.image || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Password visibility state
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<typeof profileData>) => authAPI.updateProfile(data),
    onSuccess: (response) => {
      updateUser(response);
      setIsEditingProfile(false);
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      authAPI.changePassword(data),
    onSuccess: () => {
      setIsChangingPassword(false);
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Password changed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });

  // Handle profile form change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle password form change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle profile update
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileData.firstName || !profileData.lastName) {
      toast.error('First name and last name are required');
      return;
    }

    updateProfileMutation.mutate(profileData);
  };

  // Handle password change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    changePasswordMutation.mutate({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword,
    });
  };

  // Cancel profile edit
  const handleCancelEdit = () => {
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      image: user?.image || '',
    });
    setIsEditingProfile(false);
  };

  // Cancel password change
  const handleCancelPasswordChange = () => {
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangingPassword(false);
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 mt-1">Manage your account settings and preferences</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                {/* Profile Image */}
                <div className="relative mb-4">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-32 h-32 rounded-full object-cover ring-4 ring-slate-100"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-slate-900 flex items-center justify-center text-white text-4xl font-bold ring-4 ring-slate-100">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border-2 border-slate-100 hover:bg-slate-50 transition-colors">
                    <Camera className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

                {/* Name and Role */}
                <h2 className="text-xl font-bold text-slate-900 text-center">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm text-slate-500 mt-1 capitalize">{user?.role || 'Admin'}</p>

                {/* Email */}
                <div className="flex items-center gap-2 mt-4 text-slate-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user?.email}</span>
                </div>

                {/* Phone */}
                {user?.phone && (
                  <div className="flex items-center gap-2 mt-2 text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}

                {/* Last Login */}
                <div className="w-full mt-6 pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Last Login:</span>
                    <div className="flex items-center gap-1 text-slate-700">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs">
                        {formatDate(user?.lastLogin?.toString())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role & Permissions Card */}
          <Card className="shadow-md mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                Role & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Role</p>
                <p className="text-sm font-medium text-slate-900 capitalize">
                  {user?.role || 'Admin'}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-500">Permissions</p>
                <div className="space-y-1">
                  {user?.permissions && (
                    <>
                      {Object.entries(user.permissions).map(([key, value]) => {
                        const hasAnyPermission = Object.values(value as any).some((v) => v === true);
                        if (!hasAnyPermission) return null;

                        return (
                          <div key={key} className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 capitalize">{key}</span>
                            <span className="text-green-600 font-medium">Granted</span>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information & Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile Card */}
          <Card className="shadow-md">
            <CardHeader className="border-b bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Profile Information
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Update your personal information
                  </CardDescription>
                </div>
                {!isEditingProfile && (
                  <Button
                    onClick={() => setIsEditingProfile(true)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        placeholder="Enter first name"
                        required
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        placeholder="Enter last name"
                        required
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="Enter phone number"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Profile Image URL</Label>
                    <Input
                      id="image"
                      name="image"
                      type="url"
                      value={profileData.image}
                      onChange={handleProfileChange}
                      placeholder="Enter image URL"
                      className="mt-1.5"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      className="gap-2"
                      disabled={updateProfileMutation.isPending}
                    >
                      <Save className="w-4 h-4" />
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">First Name</p>
                      <p className="text-base font-medium text-slate-900">{user?.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Last Name</p>
                      <p className="text-base font-medium text-slate-900">{user?.lastName}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 mb-1">Email Address</p>
                    <p className="text-base font-medium text-slate-900">{user?.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 mb-1">Phone Number</p>
                    <p className="text-base font-medium text-slate-900">
                      {user?.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="shadow-md">
            <CardHeader className="border-b bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    Security Settings
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Change your password to keep your account secure
                  </CardDescription>
                </div>
                {!isChangingPassword && (
                  <Button
                    onClick={() => setIsChangingPassword(true)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isChangingPassword ? (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <Label htmlFor="oldPassword">Current Password *</Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="oldPassword"
                        name="oldPassword"
                        type={showOldPassword ? 'text' : 'password'}
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showOldPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password *</Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password (min 6 characters)"
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Re-enter new password"
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      className="gap-2"
                      disabled={changePasswordMutation.isPending}
                    >
                      <Save className="w-4 h-4" />
                      {changePasswordMutation.isPending
                        ? 'Changing...'
                        : 'Change Password'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelPasswordChange}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="py-4">
                  <p className="text-sm text-slate-600">
                    Click the "Change Password" button to update your password. Make sure to use a
                    strong password with at least 6 characters.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}
