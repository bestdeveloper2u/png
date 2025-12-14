import random

def GENERATE_USER_ID(role: str) -> str:
    role_prefix = {
        'admin': 'A',
        'user': 'U',
    }.get(role.lower())

    if not role_prefix:
        raise ValueError("Invalid role provided. Must be 'admin', 'user'.")

    random_number = random.randint(1000000, 9999999)
    return f"{role_prefix}-{random_number}"
