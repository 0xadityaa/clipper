"use client";

import type { Clip } from "@prisma/client";
import { Download, Loader2, Play, Youtube, Instagram, Share2, MessageCircle, Linkedin, Facebook, Camera, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getClipPlayUrl, deleteClip } from "~/actions/generation";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";

function ClipCard({ clip }: { clip: Clip }) {
  const [playUrl, setPlayUrl] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchPlayUrl() {
      try {
        const result = await getClipPlayUrl(clip.id);
        if (result.succes && result.url) {
          setPlayUrl(result.url);
        } else if (result.error) {
          console.error("Failed to get play url: " + result.error);
        }
      } catch {
      } finally {
        setIsLoadingUrl(false);
      }
    }

    void fetchPlayUrl();
  }, [clip.id]);

  const handleDownload = () => {
    if (playUrl) {
      const link = document.createElement("a");
      link.href = playUrl;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = () => {
    if (isDeleting) return;

    toast("Are you sure you want to delete this clip?", {
      description: "This action cannot be undone. The clip will be permanently removed from your account and storage.",
      action: {
        label: "Delete",
        onClick: () => {
          void (async () => {
            setIsDeleting(true);
            try {
              const result = await deleteClip(clip.id);
              if (result.success) {
                toast.success("Clip deleted successfully!");
              } else {
                toast.error(result.error ?? "Failed to delete clip");
              }
            } catch {
              toast.error("An error occurred while deleting the clip");
            } finally {
              setIsDeleting(false);
            }
          })();
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          // Do nothing, just dismiss the toast
        },
      },
    });
  };

  const handleShareToYoutube = () => {
    if (playUrl) {
      // YouTube Shorts upload deep link
      const youtubeUrl = `https://www.youtube.com/upload`;
      window.open(youtubeUrl, '_blank');
      
      // Download the video for manual upload (since YouTube doesn't support direct video links)
      handleDownload();
    }
  };

  const handleShareToInstagram = () => {
    if (playUrl) {
      // Instagram deep link - opens Instagram app or web
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Try to open Instagram app
        window.open('instagram://camera', '_blank');
        // Fallback: download video for manual sharing
        setTimeout(() => handleDownload(), 1000);
      } else {
        // Desktop: open Instagram web and download video
        window.open('https://www.instagram.com/', '_blank');
        handleDownload();
      }
    }
  };

  const handleShareToTikTok = () => {
    if (playUrl) {
      // TikTok deep link
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Try to open TikTok app
        window.open('tiktok://camera', '_blank');
        // Fallback: download video for manual sharing
        setTimeout(() => handleDownload(), 1000);
      } else {
        // Desktop: open TikTok web and download video
        window.open('https://www.tiktok.com/upload', '_blank');
        handleDownload();
      }
    }
  };

  const handleShareToTwitter = () => {
    if (playUrl) {
      const tweetText = encodeURIComponent("Check out this amazing clip I created with Clipper! 🎬");
      const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(playUrl)}`;
      window.open(twitterUrl, '_blank');
    }
  };

  const handleShareToLinkedIn = () => {
    if (playUrl) {
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(playUrl)}`;
      window.open(linkedInUrl, '_blank');
    }
  };

  const handleShareToFacebook = () => {
    if (playUrl) {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(playUrl)}`;
      window.open(facebookUrl, '_blank');
    }
  };

  const handleShareToSnapchat = () => {
    if (playUrl) {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Try to open Snapchat app
        window.open('snapchat://camera', '_blank');
        setTimeout(() => handleDownload(), 1000);
      } else {
        // Desktop: open Snapchat web
        window.open('https://web.snapchat.com/', '_blank');
        handleDownload();
      }
    }
  };

  const handleShareToReddit = () => {
    if (playUrl) {
      const title = encodeURIComponent("Amazing clip created with Clipper");
      const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(playUrl)}&title=${title}`;
      window.open(redditUrl, '_blank');
    }
  };

  const handleShareToWhatsApp = () => {
    if (playUrl) {
      const message = encodeURIComponent(`Check out this clip I created! ${playUrl}`);
      const whatsappUrl = `https://wa.me/?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleShareToTelegram = () => {
    if (playUrl) {
      const message = encodeURIComponent(`Check out this amazing clip! ${playUrl}`);
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(playUrl)}&text=${message}`;
      window.open(telegramUrl, '_blank');
    }
  };

  const handleShareToDiscord = () => {
    if (playUrl) {
      // Discord doesn't have a direct share URL, so we copy the link to clipboard
      navigator.clipboard.writeText(`Check out this clip I created with Clipper! ${playUrl}`).then(() => {
        toast.success('Link copied to clipboard! Paste it in Discord.');
      }).catch(() => {
        // Fallback: open Discord web
        window.open('https://discord.com/', '_blank');
      });
    }
  };

  const handleGenericShare = async () => {
    if (playUrl && navigator.share) {
      try {
        // Use Web Share API to share the URL directly
        await navigator.share({
          title: 'Check out this clip!',
          text: 'Generated with Clipper',
          url: playUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback: copy to clipboard
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(playUrl);
          toast.success('Link copied to clipboard!');
        }
      }
    } else if (navigator.clipboard && playUrl) {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(playUrl);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className="flex max-w-52 flex-col gap-2">
      <div className="bg-muted">
        {isLoadingUrl ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        ) : playUrl ? (
          <video
            src={playUrl}
            controls
            preload="metadata"
            className="h-full w-full rounded-md object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Play className="text-muted-foreground h-10 w-10 opacity-50" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={handleDownload} variant="outline" size="sm">
          <Download className="mr-1.5 h-4 w-4" />
          Download
        </Button>
        
        {/* Share Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Share2 className="mr-1.5 h-4 w-4" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Share to Platform</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Video Platforms */}
            <DropdownMenuItem onClick={handleShareToYoutube} className="cursor-pointer">
              <Youtube className="mr-2 h-4 w-4 text-white" />
              YouTube
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareToTikTok} className="cursor-pointer">
              <svg className="mr-2 h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-1.394-.157A6.441 6.441 0 0 0 2.5 15.69a6.441 6.441 0 0 0 7.043 6.447 6.441 6.441 0 0 0 5.98-6.447V8.769a8.219 8.219 0 0 0 4.066 1.06v-3.143z"/>
              </svg>
              TikTok
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareToInstagram} className="cursor-pointer">
              <Instagram className="mr-2 h-4 w-4 text-white" />
              Instagram
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareToSnapchat} className="cursor-pointer">
              <Camera className="mr-2 h-4 w-4 text-white" />
              Snapchat
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Social Media */}
            <DropdownMenuItem onClick={handleShareToTwitter} className="cursor-pointer">
              <svg className="mr-2 h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter / X
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareToFacebook} className="cursor-pointer">
              <Facebook className="mr-2 h-4 w-4 text-white" />
              Facebook
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareToLinkedIn} className="cursor-pointer">
              <Linkedin className="mr-2 h-4 w-4 text-white" />
              LinkedIn
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareToReddit} className="cursor-pointer">
              <svg className="mr-2 h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
              Reddit
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Messaging */}
            <DropdownMenuItem onClick={handleShareToWhatsApp} className="cursor-pointer">
              <MessageCircle className="mr-2 h-4 w-4 text-white" />
              WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareToTelegram} className="cursor-pointer">
              <svg className="mr-2 h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.306.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Telegram
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareToDiscord} className="cursor-pointer">
              <svg className="mr-2 h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
              </svg>
              Discord
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Generic Share */}
            <DropdownMenuItem onClick={handleGenericShare} className="cursor-pointer">
              <Share2 className="mr-2 h-4 w-4 text-white" />
              More Options
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete Button */}
        <Button 
          onClick={handleDelete} 
          variant="outline" 
          size="sm"
          disabled={isDeleting}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
        >
          {isDeleting ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-1.5 h-4 w-4" />
          )}
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}

export function ClipDisplay({ clips }: { clips: Clip[] }) {
  if (clips.length === 0) {
    return (
      <p className="text-muted-foreground p-4 text-center">
        No clips generated yet.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {clips.map((clip) => (
        <ClipCard key={clip.id} clip={clip} />
      ))}
    </div>
  );
}
