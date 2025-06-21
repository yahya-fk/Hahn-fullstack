package org.example.backend.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JWTAuthorizationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String jwt = request.getHeader("Authorization");
        if(jwt==null || !jwt.startsWith(SecurityParameters.PREFIX)){
            filterChain.doFilter(request, response);
            return;
        }

        try {
            jwt = jwt.substring(SecurityParameters.PREFIX.length()).trim();
            
            if(jwt.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\":\"Empty JWT token\"}");
                return;
            }
            
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SecurityParameters.SECRET)).build();
            DecodedJWT decodedJWT = verifier.verify(jwt);
            String username = decodedJWT.getSubject();
            List<String> roles = decodedJWT.getClaims().get("roles").asList(String.class);
            Collection<GrantedAuthority> authorities = new ArrayList<>();
            for(String role : roles){
                String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                authorities.add(new SimpleGrantedAuthority(roleWithPrefix));
            }
            UsernamePasswordAuthenticationToken user = new UsernamePasswordAuthenticationToken(username, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(user);
        } catch (Exception e) {
            System.err.println("JWT Authentication failed: " + e.getMessage());
            System.err.println("Original Authorization header: " + request.getHeader("Authorization"));
            System.err.println("Extracted JWT token: " + jwt);
            
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Invalid JWT token: " + e.getMessage() + "\"}");
            return;
        }
        
        filterChain.doFilter(request, response);
    }
}
