
import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface MarketingConfig {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  seo_og_image: string;
  favicon: string;
  tracking_enabled: boolean;
  meta_pixel_id: string;
  gtm_id: string;
  custom_scripts: string;
}

export function SEO() {
  const [config, setConfig] = useState<MarketingConfig | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from("marketing_config")
        .select("*")
        .maybeSingle();

      if (data) {
        setConfig(data);
      }
    };

    fetchConfig();
  }, []);

  if (!config) return null;

  return (
    <>
      {config.seo_title && <title>{config.seo_title}</title>}
      {config.seo_description && (
        <meta name="description" content={config.seo_description} />
      )}
      {config.seo_keywords && (
        <meta name="keywords" content={config.seo_keywords} />
      )}
      {config.seo_og_image && (
        <meta property="og:image" content={config.seo_og_image} />
      )}
      {config.favicon && (
        <link rel="icon" href={config.favicon} type="image/x-icon" />
      )}
      {config.tracking_enabled && (
        <>
          {config.gtm_id && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${config.gtm_id}');
                `,
              }}
            />
          )}
          {config.meta_pixel_id && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${config.meta_pixel_id}');
                  fbq('track', 'PageView');
                `,
              }}
            />
          )}
          {config.custom_scripts && (
            <script
              dangerouslySetInnerHTML={{
                __html: config.custom_scripts,
              }}
            />
          )}
        </>
      )}
    </>
  );
}
