<script>
        document.addEventListener('DOMContentLoaded', function() {
            const menuButton = document.querySelector('button[aria-label="Open mobile menu"]');
            const mobileMenu = document.getElementById('mobile-menu');

            if (menuButton && mobileMenu) {
                menuButton.addEventListener('click', function() {
                    mobileMenu.classList.toggle('hidden');
                });
            }
        });
    </script>
