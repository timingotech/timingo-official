/**
 * Comprehensive Link Tracking Library
 * Automatically detects and tracks all link clicks on your website
 * 
 * Usage:
 * <script src="tracking.js"></script>
 * <script>
 *   LinkTracker.init({
 *     apiUrl: 'https://your-backend-url.com',
 *     userEmail: 'user@example.com',  // Optional: identify the user
 *     leadId: 123,                      // Optional: associate with a lead
 *     campaignSource: 'website',        // Optional: campaign source
 *     campaignMedium: 'organic',        // Optional: campaign medium
 *     campaignName: 'homepage'          // Optional: campaign name
 *   });
 * </script>
 */

(function(window) {
  'use strict';

  var LinkTracker = {
    config: {
      apiUrl: '',
      userEmail: null,
      leadId: null,
      campaignSource: 'website',
      campaignMedium: 'direct',
      campaignName: '',
      sessionId: '',
      trackExternal: true,
      trackInternal: false,
      trackDownloads: true,
      trackMailto: true,
      trackTel: true,
      trackPageViews: true,
      trackScroll: true,
      trackForms: true,
      trackSessionDuration: true,
      debug: false
    },

    sessionStartMs: 0,
    maxScrollDepth: 0,

    /**
     * Initialize the tracker
     */
    init: function(options) {
      // Merge options with defaults
      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          this.config[key] = options[key];
        }
      }

      // Validate required config
      if (!this.config.apiUrl) {
        console.error('[LinkTracker] apiUrl is required');
        return;
      }

      this.log('Initialized with config:', this.config);

      this.hydrateIdentityFromUrl();
      this.cleanTrackingParamsFromUrl();

      if (!this.config.sessionId) {
        this.config.sessionId = this.generateSessionId();
      }
      this.sessionStartMs = Date.now();
      this.maxScrollDepth = 0;

      // Attach click listener to document
      this.attachListeners();

      if (this.config.trackPageViews) {
        this.trackEvent('page_view', {
          event_name: 'page_view',
          target_url: window.location.href
        });
      }
    },

    /**
     * Attach event listeners
     */
    attachListeners: function() {
      var self = this;
      
      // Use event delegation on document for all clicks
      document.addEventListener('click', function(event) {
        // Find the closest anchor tag
        var link = event.target.closest('a');
        if (!link) return;

        self.handleLinkClick(link, event);
      }, false);

      if (this.config.trackForms) {
        document.addEventListener('submit', function(event) {
          var form = event.target;
          if (!form || !form.tagName || form.tagName.toLowerCase() !== 'form') return;
          self.trackEvent('form_submit', {
            event_name: form.getAttribute('id') || form.getAttribute('name') || 'form_submit',
            metadata: {
              action: form.getAttribute('action') || '',
              method: form.getAttribute('method') || 'GET'
            }
          });
        }, false);
      }

      if (this.config.trackScroll) {
        var scrollTimeout = null;
        window.addEventListener('scroll', function() {
          if (scrollTimeout) return;
          scrollTimeout = setTimeout(function() {
            scrollTimeout = null;
            var doc = document.documentElement;
            var scrollTop = window.pageYOffset || doc.scrollTop || 0;
            var total = Math.max(1, (doc.scrollHeight - window.innerHeight));
            var depth = Math.min(100, Math.round((scrollTop / total) * 100));
            if (depth > self.maxScrollDepth + 10) {
              self.maxScrollDepth = depth;
              self.trackEvent('scroll_depth', {
                event_name: 'scroll_depth',
                scroll_depth: depth
              });
            }
          }, 700);
        }, { passive: true });
      }

      if (this.config.trackSessionDuration) {
        document.addEventListener('visibilitychange', function() {
          if (document.visibilityState === 'hidden') {
            self.trackSessionEnd('visibility_hidden');
          }
        });
        window.addEventListener('beforeunload', function() {
          self.trackSessionEnd('before_unload');
        });
      }

      this.log('Event listeners attached');
    },

    /**
     * Handle link click
     */
    handleLinkClick: function(link, event) {
      var href = link.getAttribute('href');
      if (!href) return;

      href = this.normalizeTrackableUrl(href);

      var shouldTrack = this.shouldTrackLink(href);
      if (!shouldTrack) return;

      this.log('Tracking link click:', href);

      // Track the click
      this.trackClick(href);

      // For external links, add small delay to ensure tracking completes
      if (this.isExternalLink(href) && !event.ctrlKey && !event.metaKey && link.target !== '_blank') {
        event.preventDefault();
        var self = this;
        setTimeout(function() {
          window.location.href = href;
        }, 150);
      }
    },

    generateSessionId: function() {
      return 'sess_' + Math.random().toString(36).slice(2) + '_' + Date.now().toString(36);
    },

    hydrateIdentityFromUrl: function() {
      try {
        var params = new URLSearchParams(window.location.search || '');
        var emailFromUrl = params.get('lt_email');
        var leadIdFromUrl = params.get('lt_lead_id');

        if (emailFromUrl) {
          this.config.userEmail = emailFromUrl;
          sessionStorage.setItem('lt_user_email', emailFromUrl);
        } else if (!this.config.userEmail) {
          this.config.userEmail = sessionStorage.getItem('lt_user_email') || this.config.userEmail;
        }

        if (leadIdFromUrl) {
          this.config.leadId = Number(leadIdFromUrl) || this.config.leadId;
          sessionStorage.setItem('lt_lead_id', String(leadIdFromUrl));
        } else if (!this.config.leadId) {
          var storedLeadId = sessionStorage.getItem('lt_lead_id');
          if (storedLeadId) this.config.leadId = Number(storedLeadId) || this.config.leadId;
        }
      } catch (e) {
        this.log('Failed to hydrate identity from URL:', e);
      }
    },

    /**
     * Clean tracking parameters from the URL to avoid exposing user data
     */
    cleanTrackingParamsFromUrl: function() {
      try {
        if (!window.history || !window.history.replaceState) return;
        
        var url = new URL(window.location.href);
        var params = url.searchParams;
        
        // Check if any tracking params exist
        var hasTrackingParams = params.has('lt_email') || params.has('lt_lead_id') || 
                                params.has('lt_message_id') || params.has('lt_source');
        
        if (!hasTrackingParams) return;
        
        // Remove all tracking parameters
        params.delete('lt_email');
        params.delete('lt_lead_id');
        params.delete('lt_message_id');
        params.delete('lt_source');
        
        // Build clean URL
        var cleanUrl = url.pathname + (url.search ? url.search : '') + url.hash;
        
        // Replace the URL without reloading the page
        window.history.replaceState({}, document.title, cleanUrl);
        
        this.log('Cleaned tracking parameters from URL');
      } catch (e) {
        this.log('Failed to clean tracking parameters:', e);
      }
    },

    normalizeTrackableUrl: function(href) {
      if (!href) return href;
      var trimmed = String(href).trim();
      if (!trimmed || /^(#|mailto:|tel:|data:|javascript:)/i.test(trimmed)) return trimmed;
      if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;

      var domainCandidate = trimmed.split('/')[0];
      if (domainCandidate.indexOf('.') !== -1 && domainCandidate.indexOf(' ') === -1) {
        return 'https://' + trimmed;
      }
      return trimmed;
    },

    trackSessionEnd: function(source) {
      if (!this.sessionStartMs) return;
      var durationSec = Math.max(1, Math.round((Date.now() - this.sessionStartMs) / 1000));
      this.trackEvent('session_end', {
        event_name: source || 'session_end',
        dwell_seconds: durationSec,
        scroll_depth: this.maxScrollDepth,
        metadata: {
          path: window.location.pathname,
          title: document.title || ''
        }
      });
    },

    /**
     * Determine if link should be tracked
     */
    shouldTrackLink: function(href) {
      if (!href) return false;

      href = this.normalizeTrackableUrl(href);

      // Skip anchor links
      if (href.startsWith('#')) return false;

      // Skip data URIs
      if (href.startsWith('data:')) return false;

      // Skip javascript: URIs
      if (href.startsWith('javascript:')) return false;

      // Check mailto links
      if (href.startsWith('mailto:')) {
        return this.config.trackMailto;
      }

      // Check tel links
      if (href.startsWith('tel:')) {
        return this.config.trackTel;
      }

      // Check download links
      if (this.config.trackDownloads && this.isDownloadLink(href)) {
        return true;
      }

      // Check external vs internal
      var isExternal = this.isExternalLink(href);
      if (isExternal && this.config.trackExternal) {
        return true;
      }

      if (!isExternal && this.config.trackInternal) {
        return true;
      }

      return false;
    },

    /**
     * Check if link is external
     */
    isExternalLink: function(href) {
      href = this.normalizeTrackableUrl(href);

      if (href.startsWith('mailto:') || href.startsWith('tel:')) {
        return false;
      }

      try {
        var link = document.createElement('a');
        link.href = href;
        return link.hostname !== window.location.hostname;
      } catch (e) {
        return false;
      }
    },

    /**
     * Check if link is a download
     */
    isDownloadLink: function(href) {
      var downloadExtensions = [
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
        'zip', 'rar', '7z', 'tar', 'gz',
        'exe', 'dmg', 'pkg',
        'mp3', 'mp4', 'avi', 'mov',
        'jpg', 'jpeg', 'png', 'gif', 'svg'
      ];

      var extension = href.split('.').pop().toLowerCase().split('?')[0];
      return downloadExtensions.indexOf(extension) !== -1;
    },

    /**
     * Track the click by sending data to backend
     */
    trackClick: function(targetUrl) {
      targetUrl = this.normalizeTrackableUrl(targetUrl);
      var data = {
        target_url: targetUrl,
        event_name: 'link_click'
      };
      this.trackEvent('link_click', data);

      this.log('Tracked click:', data);
    },

    trackEvent: function(eventType, extras) {
      var data = {
        event_type: eventType,
        url: window.location.href,
        target_url: null,
        event_name: '',
        user_email: this.config.userEmail,
        lead_id: this.config.leadId,
        session_id: this.config.sessionId,
        dwell_seconds: null,
        scroll_depth: null,
        metadata: {},
        campaign_source: this.config.campaignSource,
        campaign_medium: this.config.campaignMedium,
        campaign_name: this.config.campaignName
      };
      if (extras) {
        for (var key in extras) {
          if (extras.hasOwnProperty(key)) {
            data[key] = extras[key];
          }
        }
      }

      if (navigator.sendBeacon) {
        var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        navigator.sendBeacon(this.config.apiUrl + '/track/event', blob);
      } else {
        fetch(this.config.apiUrl + '/track/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
          keepalive: true
        }).catch(function(err) {
          console.warn('[LinkTracker] Failed to track:', err);
        });
      }

      this.log('Tracked event:', eventType, data);
    },

    /**
     * Log debug messages
     */
    log: function() {
      if (this.config.debug) {
        console.log.apply(console, ['[LinkTracker]'].concat(Array.prototype.slice.call(arguments)));
      }
    }
  };

  // Expose to window
  window.LinkTracker = LinkTracker;

})(window);
