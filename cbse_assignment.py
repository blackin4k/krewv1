# AI Questions for Project Work Submission of Annual Examination
# (as per CBSE Marking pattern)

# --------------------------------------------------------------------------------
# 1. Write a program to accept a number and check whether it is divisible by 12.
# --------------------------------------------------------------------------------
print("--- Question 1 ---")
try:
    num = int(input("Enter a number: "))
    if num % 12 == 0:
        print(f"{num} is divisible by 12.")
    else:
        print(f"{num} is not divisible by 12.")
except ValueError:
    print("Please enter a valid integer.")
print()


# --------------------------------------------------------------------------------
# 2. Write a program to find numbers which are multiple of 5 between 1000 and 2000
# --------------------------------------------------------------------------------
print("--- Question 2 ---")
print("Multiples of 5 between 1000 and 2000:")
# range(1000, 2001) is used to include 2000 in the check
for i in range(1000, 2001):
    if i % 5 == 0:
        print(i, end=" ")
print("\n")


# --------------------------------------------------------------------------------
# 3. Write a program to print all even numbers between 10 and 50
# --------------------------------------------------------------------------------
print("--- Question 3 ---")
print("Even numbers between 10 and 50:")
# range(10, 51) is used so that 50 is included
for i in range(10, 51):
    if i % 2 == 0:
        print(i, end=" ")
print("\n")


# --------------------------------------------------------------------------------
# 4. Write a program to accept a list and print all the elements one by one.
# --------------------------------------------------------------------------------
print("--- Question 4 ---")
try:
    n = int(input("Enter the number of elements you want in the list: "))
    user_list = []
    for i in range(n):
        elem = input(f"Enter element {i+1}: ")
        user_list.append(elem)
        
    print("\nPrinting elements one by one:")
    for element in user_list:
        print(element)
except ValueError:
    print("Please enter a valid integer for the number of elements.")
print()


# --------------------------------------------------------------------------------
# 5. Write a program to accept a list and perform the following tasks on the list.
#    a) Print the whole list
#    b) Delete the last element from the list
#    c) Add a new element at the end
#    d) Remove the item which is at the second position
# --------------------------------------------------------------------------------
print("--- Question 5 ---")
try:
    n2 = int(input("Enter the number of elements for the list: "))
    task_list = []
    for i in range(n2):
        elem = input(f"Enter element {i+1}: ")
        task_list.append(elem)

    # a) Print the whole list
    print("\na) The whole list is:")
    print(task_list)

    # b) Delete the last element from the list
    if len(task_list) > 0:
        task_list.pop()  # pop() removes the last element by default
        print("\nb) List after deleting the last element:")
        print(task_list)
    else:
        print("\nb) The list is empty. Cannot delete the last element.")

    # c) Add a new element at the end
    new_item = input("\nEnter a new element to add at the end: ")
    task_list.append(new_item)
    print("c) List after adding the new element:")
    print(task_list)

    # d) Remove the item which is at the second position
    # The second position corresponds to index 1 (since lists are 0-indexed)
    if len(task_list) >= 2:
        task_list.pop(1)
        print("\nd) List after removing the item at the second position:")
        print(task_list)
    else:
        print("\nd) The list does not have a second position to remove.")

except ValueError:
    print("Please enter a valid integer for the number of elements.")
print()
