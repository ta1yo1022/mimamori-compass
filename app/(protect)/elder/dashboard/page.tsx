"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export default function page() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedUser = Cookies.get("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setLoading(false)
            } else {
                setUser(null);
                setLoading(false)
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        loading ? (
            <div></div>
        ) : (
            <div>
                
            </div >
        )
    );
}