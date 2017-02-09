#import <React/RCTView.h>

@class RCTDZWebView;

/**
 * Special scheme used to pass messages to the injectedJavaScript
 * code without triggering a page load. Usage:
 *
 *   window.location.href = RCTJSNavigationScheme + '://hello'
 */
extern NSString *const RCTJSNavigationScheme;

@protocol RCTDZWebViewDelegate <NSObject>

- (BOOL)webView:(RCTDZWebView *)webView
shouldStartLoadForRequest:(NSMutableDictionary<NSString *, id> *)request
   withCallback:(RCTDirectEventBlock)callback;

@end

@interface RCTDZWebView : RCTView

@property (nonatomic, weak) id<RCTDZWebViewDelegate> delegate;

@property (nonatomic, copy) NSDictionary *source;
@property (nonatomic, assign) UIEdgeInsets contentInset;
@property (nonatomic, assign) BOOL automaticallyAdjustContentInsets;
@property (nonatomic, assign) BOOL sendCookies;
@property (nonatomic, assign) BOOL openNewWindowInWebView;
@property (nonatomic, copy) NSString *injectedJavaScript;


- (void)goForward;
- (void)goBack;
- (void)reload;
- (void)stopLoading;
- (void)evaluateJavaScript:(NSString *)javaScriptString completionHandler:(void (^)(id, NSError *error))completionHandler;

@end
