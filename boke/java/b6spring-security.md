##### 使用教程

https://blog.csdn.net/gs2516230558/article/details/141259246?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ECtr-1-141259246-blog-136421121.235%5Ev43%5Epc_blog_bottom_relevance_base5&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ECtr-1-141259246-blog-136421121.235%5Ev43%5Epc_blog_bottom_relevance_base5&utm_relevant_index=1

###### 引入依赖

```
<!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
    <security-version>3.3.0</security-version>
</dependency>
```

###### 实现LoginAclDto和UserInfoDto

```java
package com.manst.mro.security;

import com.manst.mro.constant.UserStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

/**
 * ClassName: LoginAclDto
 * Package: com.manst.mro.sys.acl.dto
 * Description:
 *
 * @Author: HuBaoHua
 * @Create: 2024/9/9-14:57
 * @Version: v1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor//用于构造UserDetails对象，且提供了获取用户名、密码、权限等信息
public class LoginAclDto implements UserDetails {
    private UserInfoDto userInfo;//你要存储的其他用户信息

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return userInfo.getAuthorities();
    }

    @Override
    public String getPassword() {
        return userInfo.getPassword();
    }

    @Override
    public String getUsername() {
        return userInfo.getUsername();
    }

    @Override// 账户是否未过期
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override// 账户是否未锁定
    public boolean isAccountNonLocked() {
        return userInfo.getStatusFlag() == UserStatusEnum.NORMAL.getCode();
    }

    @Override// 凭证是否过期
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override// 用户是否可用
    public boolean isEnabled() {
        return true;
    }
}
```

```java
package com.manst.mro.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.manst.mro.sys.acl.vo.MenuVo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

/**
 * ClassName: UserAclDto
 * Package: com.manst.mro.sys.acl.dto
 * Description:
 *
 * @Author: HuBaoHua
 * @Create: 2024/9/12-17:11
 * @Version: v1.0.0
 */
@Data
@Schema(name = "UserAclDto", description = "")
public class UserInfoDto {

    @Schema(description = "菜单权限")
    private List<MenuVo> menuAuth;

    @Schema(description = "权限信息")
    private Collection<? extends GrantedAuthority> authorities;

    @Schema(description = "用户id")
    private Long userId;

    @Schema(description = "密码")
    @JsonIgnore//springboot默认jackson序列化时忽略密码
    private String password;

    @Schema(description = "姓名")
    private String realName;

    @Schema(description = "昵称")
    private String nickName;

    @Schema(description = "账号")
    private String username;

    @Schema(description = "头像")
    private String avatar;

    @Schema(description = "生日")
    private LocalDate birthday;

    @Schema(description = "性别")
    private String sex;

    @Schema(description = "邮箱")
    private String email;

    @Schema(description = "手机号码")
    private String phone;

    @Schema(description = "电话号码")
    private String tel;

    @Schema(description = "账号状态 1正常:2冻结")
    private Byte statusFlag;
}
```

###### 实现UserDetailsService

```java
package com.manst.mro.security;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.manst.mro.exception.MROException;
import com.manst.mro.mapper.SysUserMapper;
import com.manst.mro.result.ResultCodeEnum;
import com.manst.mro.service.*;

import com.manst.mro.sys.acl.entity.*;
import jakarta.annotation.Resource;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * ClassName: SysAclLoadServiceImpl
 * Package: com.manst.mro.config
 * Description:
 *
 * @Author: HuBaoHua
 * @Create: 2024/9/5-16:55
 * @Version: v1.0.0
 */
@Service
public class UserLoadService implements UserDetailsService {

    @Override//”加载“用户拿去给传入的用户信息比较
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        LambdaQueryWrapper<SysUser> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(SysUser::getUsername, username);
        SysUser user = userMapper.selectOne(queryWrapper);
        if (Objects.isNull(user)) {
            throw new MROException(ResultCodeEnum.USERNAME_NOT_FOUND);
        } else {
            //如果是超级管理员，则无需计算权限
//            if (user.getSuperAdminFlag()) {
//
//            }
            UserInfoDto userInfo = buildUserInfo(user);
            return new LoginAclDto(userInfo); //权限列表
        }
    }


    private UserInfoDto buildUserInfo(SysUser user) {
        UserInfoDto userInfo = new UserInfoDto();
        BeanUtil.copyProperties(user, userInfo);
        ArrayList<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(() ->
                "USER_PAGE_LIST"
        );
        userInfo.setAuthorities(authorities);
        return userInfo;
    }


    private Map<String, List> addAuthority(Long userId) {
        HashMap<String, List> map = new HashMap<>();

        map.put("authorities", new ArrayList<>());
        map.put("menuAuth", new ArrayList<>());

        return map;
    }
}
```

###### 配置jwtToken过滤器

```java
package com.manst.mro.security.filter;

import com.manst.mro.exception.MROException;
import com.manst.mro.mapper.SysUserMapper;
import com.manst.mro.result.ResultCodeEnum;
import com.manst.mro.security.UserInfoDto;
import com.manst.mro.utils.TokenUtil;
import jakarta.annotation.Resource;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Objects;
import java.util.stream.Stream;

@Component
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {

    @Resource
    AuthenticationManager authenticationManager;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException, IOException {
        String uri = request.getRequestURI();
        // 如果是登录接口，直接放行
        if (!uri.startsWith("/mro/acl/login")) {
            this.validateToken(request, response);
        }

        //放行
        filterChain.doFilter(request, response);
    }

    /**
     * token的校验
     *
     * @param request
     * @param response
     */
    public void validateToken(HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("token");
        String username = null;
        //如果请求头部没有获取到token，则从请求的参数中进行获取
        if (Objects.isNull(token)) {
            // 不通过，响应401状态码
            response.setStatus(401);
            throw new MROException(ResultCodeEnum.NO_LOGIN);
        }
        username = TokenUtil.getUserIdByToken(token);
        if (Objects.isNull(username)) {
            // 不通过，响应401状态码
            response.setStatus(401);
            throw new MROException(ResultCodeEnum.JWT_TOKEN_ILLEGAL);
        }
        doLoginFlush(username);
    }


    private void doLoginFlush(String username) {
        //todo 查询redis缓存中的权限信息
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken("", null, null);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }


    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String url = request.getRequestURI();
        return Stream.of("/mro/acl/login", "/swagger-resources/**", "/webjars/**", "/v3/**", "/swagger-ui.html/**",
                "/api", "/api-docs", "/api-docs/**", "/doc.html/**").anyMatch(x -> {
            AntPathMatcher pathMatcher = new AntPathMatcher();
            return pathMatcher.match(x, url);
        });
    }


    private void doOnlineFlush(String username) {
        //每次都调用authenticationManager去验证，重新查数据库，重新构建权限信息，不用缓存
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, "123456");
        Authentication authentication = authenticationManager.authenticate(auth);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
```

###### 编写handler

```java
package com.manst.mro.security.handler;

import cn.hutool.json.JSON;
import cn.hutool.json.JSONUtil;
import com.manst.mro.result.Result;
import com.manst.mro.result.ResultCodeEnum;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

//匿名用户无权限访问资源处理类
@Component
public class AnonymousAuthenticationHandler implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException, IOException {
        //设置客户端的响应的内容类型
        response.setContentType("application/json;charset=UTF-8");
        String result = null;
        ServletOutputStream outputStream = response.getOutputStream();
        // 消除循环引用
        if (authException instanceof BadCredentialsException) {
            result = JSONUtil.toJsonStr(Result.build(ResultCodeEnum.BAD_CREDENTIALS));
        } else if (authException instanceof InternalAuthenticationServiceException) {
            result = JSONUtil.toJsonStr(Result.build(ResultCodeEnum.INTERNAL_AUTHENTICATION_SERVICE));
        } else {
            result = JSONUtil.toJsonStr(Result.build(ResultCodeEnum.ANONYMOUS_USER_NO_PERMISSION));
        }
        outputStream.write(result.getBytes(StandardCharsets.UTF_8));
        outputStream.flush();
        outputStream.close();
    }
}
```

```java
package com.manst.mro.security.handler;

import cn.hutool.json.JSON;
import cn.hutool.json.JSONUtil;
import com.manst.mro.result.Result;
import com.manst.mro.result.ResultCodeEnum;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
//认证用户无权限访问的处理器
@Component
public class CustomerAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException, IOException {
        // 发生这个异常，做出处理
        response.setContentType("application/json;charset=utf-8");
        // 获取输出流
        ServletOutputStream outputStream = response.getOutputStream();
        // 消除循环引用
        String result = JSONUtil.toJsonStr(Result.build(ResultCodeEnum.NO_PERMISSION));
        outputStream.write(result.getBytes(StandardCharsets.UTF_8));
        outputStream.flush();
        outputStream.close();
    }
}
```

###### 配置security配置类

```java
package com.manst.mro.security.config;


import com.manst.mro.security.UserLoadService;
import com.manst.mro.security.filter.JwtAuthenticationTokenFilter;

import com.manst.mro.security.handler.AnonymousAuthenticationHandler;
import com.manst.mro.security.handler.CustomerAccessDeniedHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * ClassName: WebSecurityConfig
 * Package: com.manst.mro.config
 * Description:
 *
 * @Author: HuBaoHua
 * @Create: 2024/9/5-16:55
 * @Version: v1.0.0
 */
@Configuration
@RequiredArgsConstructor
//@EnableWebSecurity //spring项目需要添加此注解
@EnableMethodSecurity//开启方法授权 不能少
public class WebSecurityConfig {

    // 用户登录服务
    private final UserLoadService userLoadService;

    // 匿名用户无权限访问资源处理类
    private final AnonymousAuthenticationHandler anonymousAuthenticationHandler;

    // 认证用户无权限访问的处理器
    private final CustomerAccessDeniedHandler customerAccessDeniedHandler;

    // jwt过滤器
    private final JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter;


    /**
     * 创建BCryptPasswordEncoder注入容器
     * 此容器会自动讲密码进行加密，同时会生成随机盐，会产生不同的密文
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        // 工作因子，默认值是10，最小值是4，最大值是31，值越大运算速度越慢,避免被破解密码
        return new BCryptPasswordEncoder(4);
    }

    /**
     * 创建AuthenticationManager注入容器
     * 登录时需要调用AuthenticationManager.authenticate执行一次校验
     *
     * @param config
     * @return
     * @throws Exception
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }


    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        // 提供自定义loadUserByUsername
        authProvider.setUserDetailsService(userLoadService);
        // 指定密码编辑器
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }


    /**
     * 配置跨域
     *
     * @return
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*")); // 允许的来源
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // 允许的方法
        configuration.setAllowedHeaders(Arrays.asList("*")); // 允许的头部
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 应用于所有路径
        return source;
    }


    /**
     * 配置安全过滤器
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        //禁用CSRF保护
        httpSecurity.csrf(csrf -> csrf.disable());

        //禁用session，因为我们已经使用了JWT
        httpSecurity.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // 支持跨域
        httpSecurity.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        httpSecurity
                // 禁用httpBasic登录
                .httpBasic(AbstractHttpConfigurer::disable)
                // 禁用rememberMe
                .rememberMe(AbstractHttpConfigurer::disable)
                //取消默认登出页面的使用
                .logout(AbstractHttpConfigurer::disable)
                //取消默认登录页面的使用
                .formLogin(AbstractHttpConfigurer::disable);


        // 配置请求拦截方式
        httpSecurity.authorizeHttpRequests(auth -> auth
                //放行的请求
                .requestMatchers("/mro/acl/login", "/swagger-resources/**", "/webjars/**", "/v3/**", "/swagger-ui.html/**",
                        "/api", "/api-docs", "/api-docs/**", "/doc.html/**")
                .permitAll()
                .anyRequest()
                .authenticated()
        );

        // 把token校验过滤器添加到过滤器链中
        httpSecurity.addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class)
                // 自定义异常处理
                .exceptionHandling(exception -> exception
                        // 认证用户无权限访问的处理器
                        .accessDeniedHandler(customerAccessDeniedHandler)
                        // 匿名用户访问无权限的处理器
                        .authenticationEntryPoint(anonymousAuthenticationHandler));




        //将自己配置的PasswordEncoder放入SecurityFilterChain中
        httpSecurity.authenticationProvider(authenticationProvider());


        return httpSecurity.build();
    }

}
```

###### 编写Controller

```Java
	@Resource
    AuthenticationManager authenticationManager;

    @PostMapping("login")
    public Result doLogin(@RequestBody LoginParams loginParams) {
        //交给spring security 认证
        UsernamePasswordAuthenticationToken auth = new 							          				UsernamePasswordAuthenticationToken(
            		loginParams.getUsername(), loginParams.getPassword());
        Authentication authentication = authenticationManager.authenticate(auth);


        if (Objects.isNull(authentication)) {
            throw new MROException(ResultCodeEnum.LOGIN_FAIL);
        }

        //存入spring security上下文
        SecurityContextHolder.getContext().setAuthentication(authentication);
        LoginAclDto loginAclDto = (LoginAclDto) authentication.getPrincipal();
        //获取token
        String jwtToken = TokenUtil.getAccessToken(loginAclDto.getUsername());
        
        //构建返回对象
        LoginReturnVo loginReturnVo = new LoginReturnVo();
        loginReturnVo.setUserInfo(loginAclDto.getUserInfo());
        loginReturnVo.setToken(jwtToken);

        //todo redis缓存用户信息
        
        //登录成功返回token
        return Result.ok(loginReturnVo);
    }

 	@PreAuthorize("hasAuthority('USER_PAGE_LIST')")
    @PostMapping("/pageList")
    public Result userListPage(@RequestBody UserSearchParams userSearch) {
        List<SysUser> list = userService.page(new Page<SysUser>(userSearch.getPageNum(), 		userSearch.getPageSize())).getRecords();
        return Result.ok(list);
    }
```

###### 其他信息

loadUserByUsername执行的两种处理

###### AuthenticationSuccessHandler//登录成功的处理类

```java
public class MyAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        //获取用户身份信息
        Object principal = authentication.getPrincipal();

        //创建结果对象
        HashMap result = new HashMap();
        result.put("code", 0);
        result.put("message", "登录成功");
        result.put("data", principal);

        //转换成json字符串
        String json = JSON.toJSONString(result);

        //返回响应
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().println(json);
    }
}
form.successHandler(new MyAuthenticationSuccessHandler()) //认证成功时的处理
```

###### AuthenticationFailureHandler//登录失败的处理类

```java
public class MyAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {

        //获取错误信息
        String localizedMessage = exception.getLocalizedMessage();

        //创建结果对象
        HashMap result = new HashMap();
        result.put("code", -1);
        result.put("message", localizedMessage);

        //转换成json字符串
        String json = JSON.toJSONString(result);

        //返回响应
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().println(json);
    }
}
form.failureHandler(new MyAuthenticationFailureHandler()) //认证失败时的处理
```

###### LogoutSuccessHandler//注销登录的处理类

```java
public class MyLogoutSuccessHandler implements LogoutSuccessHandler {

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        //创建结果对象
        HashMap result = new HashMap();
        result.put("code", 0);
        result.put("message", "注销成功");

        //转换成json字符串
        String json = JSON.toJSONString(result);

        //返回响应
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().println(json);
    }
}
http.logout(logout -> {
    logout.logoutSuccessHandler(new MyLogoutSuccessHandler()); //注销成功时的处理
});
```

###### 会话并发处理

```java
public class MySessionInformationExpiredStrategy implements SessionInformationExpiredStrategy {
    @Override
    public void onExpiredSessionDetected(SessionInformationExpiredEvent event) throws IOException, ServletException {

        //创建结果对象
        HashMap result = new HashMap();
        result.put("code", -1);
        result.put("message", "该账号已从其他设备登录");

        //转换成json字符串
        String json = JSON.toJSONString(result);

        HttpServletResponse response = event.getResponse();
        //返回响应
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().println(json);
    }
}
//会话管理
http.sessionManagement(session -> {
    session
        .maximumSessions(1)
        .expiredSessionStrategy(new MySessionInformationExpiredStrategy());
});
```

##### 授权

###### 配置权限

```java
//开启授权保护
http.authorizeRequests(
        authorize -> authorize
    			//具有USER_LIST权限的用户可以访问/user/list
                .requestMatchers("/user/list").hasAuthority("USER_LIST")
    			//具有USER_ADD权限的用户可以访问/user/add
    			.requestMatchers("/user/add").hasAuthority("USER_ADD")
                //对所有请求开启授权保护
                .anyRequest()
                //已认证的请求会被自动授权
                .authenticated()
        );
```

```java
DBUserDetailsManager中的loadUserByUsername方法：
Collection<GrantedAuthority> authorities = new ArrayList<>();
authorities.add(()->"USER_LIST");
authorities.add(()->"USER_ADD");

/*authorities.add(new GrantedAuthority() {
    @Override
    public String getAuthority() {
        return "USER_LIST";
    }
});
authorities.add(new GrantedAuthority() {
    @Override
    public String getAuthority() {
        return "USER_ADD";
    }
});*/
```

###### 请求未授权的接口

```java
//匿名内部类错误处理
http.exceptionHandling(exception  -> {
    exception.authenticationEntryPoint(new MyAuthenticationEntryPoint());//请求未认证的接口
    exception.accessDeniedHandler((request, response, e)->{ //请求未授权的接口

        //创建结果对象
        HashMap result = new HashMap();
        result.put("code", -1);
        result.put("message", "没有权限");

        //转换成json字符串
        String json = JSON.toJSONString(result);

        //返回响应
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().println(json);
    });
});
```

###### 配置角色

```java
//开启授权保护
http.authorizeRequests(
        authorize -> authorize
                //具有管理员角色的用户可以访问/user/**
                .requestMatchers("/user/**").hasRole("ADMIN")
                //对所有请求开启授权保护
                .anyRequest()
                //已认证的请求会被自动授权
                .authenticated()
);
```

###### 授予角色

```java
return org.springframework.security.core.userdetails.User
        .withUsername(user.getUsername())
        .password(user.getPassword())
        .roles("ADMIN")
        .build();
```

##### RBAC

###### 基于方法的授权

```java
在配置文件中添加如下注解
@EnableMethodSecurity
return org.springframework.security.core.userdetails.User
        .withUsername(user.getUsername())
        .password(user.getPassword())
        .roles("ADMIN")
        .authorities("USER_ADD", "USER_UPDATE")//会覆盖roles配置
        .build();
//用户必须有 ADMIN 角色 并且 用户名是 admin 才能访问此方法
@PreAuthorize("hasRole('ADMIN') and authentication.name == 'admim'")
@GetMapping("/list")
public List<User> getList(){
    return userService.list();
}

//用户必须有 USER_ADD 权限 才能访问此方法
@PreAuthorize("hasAuthority('USER_ADD')")
@PostMapping("/add")
public void add(@RequestBody User user){
    userService.saveUserDetails(user);
}
```

##### OAuth2

**OAuth2最简向导：**[The Simplest Guide To OAuth 2.0](https://darutk.medium.com/the-simplest-guide-to-oauth-2-0-8c71bd9a15bb)

 
