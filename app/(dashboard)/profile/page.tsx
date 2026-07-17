"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Avatar } from "@/components/dashboard/avatar";
import { Button } from "@/components/ui/button";
import { ImageCropper } from "@/components/dashboard/image-cropper";
import { readFile } from "@/lib/image";

const fieldClasses =
  "w-full rounded-lg border border-white/10 bg-surface-2/60 px-3 py-2 text-base text-on-surface outline-none transition-colors focus:border-accent-cyan/50 placeholder-on-surface-variant/40";

const labelClasses =
  "font-label-mono text-xs uppercase tracking-wider text-on-surface-variant";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateUser({ 
      name: name.trim() || user!.name,
      avatarUrl: avatarUrl.trim() || undefined
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageDataUrl = await readFile(file);
        setCropSrc(imageDataUrl);
      } catch (err) {
        console.error("Resim yüklenirken hata oluştu:", err);
      }
      // Reset input so the same file can be selected again
      e.target.value = "";
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="mb-2 text-5xl font-bold tracking-tight text-on-surface md:text-6xl">
          Profil
        </h2>
        <p className="max-w-2xl text-base text-on-surface-variant">
          Hesap bilgilerinizi görüntüleyin ve düzenleyin.
        </p>
      </div>

      <div className="glass-panel max-w-xl rounded-xl p-8">
        <div className="mb-8 flex items-center gap-5">
          <label className="relative cursor-pointer group">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            <Avatar
              name={user.name}
              url={avatarUrl || user.avatarUrl}
              className="size-20 border border-white/10 text-lg group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold font-mono">DEĞİŞTİR</span>
            </div>
          </label>
          <div>
            <p className="text-2xl font-bold text-on-surface">{user.name}</p>
            <p className="font-label-mono text-sm text-on-surface-variant/70">
              {user.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="display-name" className={labelClasses}>
              Görünen Ad
            </label>
            <input
              id="display-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClasses}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="profile-email" className={labelClasses}>
              E-posta
            </label>
            <input
              id="profile-email"
              value={user.email}
              disabled
              className={`${fieldClasses} cursor-not-allowed opacity-60`}
            />
          </div>



          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              className="bg-accent-cyan text-white hover:bg-accent-cyan/90"
            >
              Kaydet
            </Button>
            {saved && (
              <span className="flex items-center gap-1 font-label-mono text-xs text-accent-cyan">
                <Check className="size-4" />
                Kaydedildi
              </span>
            )}
          </div>
        </form>
      </div>

      {cropSrc && (
        <ImageCropper
          open={!!cropSrc}
          imageSrc={cropSrc}
          onClose={() => setCropSrc(null)}
          onComplete={(cropped) => {
            setAvatarUrl(cropped);
            setCropSrc(null);
          }}
        />
      )}
    </>
  );
}
