package org.example.backend.web.api;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.example.backend.dao.entity.User;
import org.example.backend.security.SecurityParameters;
import org.example.backend.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthRestController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AccountService accountService;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = JWT.create()
                    .withSubject(userDetails.getUsername())
                    .withExpiresAt(new Date(System.currentTimeMillis() + SecurityParameters.EXPIRATION_TIME))
                    .withClaim("roles", userDetails.getAuthorities().stream().map(auth -> auth.getAuthority()).toList())
                    .sign(Algorithm.HMAC256(SecurityParameters.SECRET));
            Map<String, String> response = new HashMap<>();
            response.put("token", SecurityParameters.PREFIX + jwt);
            response.put("username", userDetails.getUsername());
            response.put("expiresAt", String.valueOf(System.currentTimeMillis() + SecurityParameters.EXPIRATION_TIME));
            return response;
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid login credentials");
        }
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return accountService.saveUser(user);
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyToken(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> response = new HashMap<>();
        
        if (authHeader == null || !authHeader.startsWith(SecurityParameters.PREFIX)) {
            response.put("valid", false);
            response.put("message", "No valid token provided");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        try {
            String token = authHeader.substring(SecurityParameters.PREFIX.length());
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SecurityParameters.SECRET)).build();
            DecodedJWT decodedJWT = verifier.verify(token);
            
            response.put("valid", true);
            response.put("username", decodedJWT.getSubject());
            response.put("roles", decodedJWT.getClaim("roles").asList(String.class));
            response.put("expiresAt", decodedJWT.getExpiresAt().getTime());
            
            return ResponseEntity.ok(response);
        } catch (JWTVerificationException e) {
            response.put("valid", false);
            response.put("message", "Invalid or expired token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, String> response = new HashMap<>();
        
        // For JWT, we mainly rely on client-side token removal
        // In a production environment, you might want to implement a token blacklist
        response.put("message", "Successfully logged out");
        response.put("instructions", "Please remove the token from client storage");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> response = new HashMap<>();
        
        if (authHeader == null || !authHeader.startsWith(SecurityParameters.PREFIX)) {
            response.put("error", "No valid token provided");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        try {
            String token = authHeader.substring(SecurityParameters.PREFIX.length());
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SecurityParameters.SECRET)).build();
            DecodedJWT decodedJWT = verifier.verify(token);
            
            String username = decodedJWT.getSubject();
            User user = accountService.findUserByUsername(username);
            
            if (user != null) {
                response.put("username", user.getUsername());
                response.put("roles", user.getRoles());
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (JWTVerificationException e) {
            response.put("error", "Invalid or expired token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}
