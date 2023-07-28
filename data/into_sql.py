import pandas as pd

def create_sql_file(data):
    with open("pokemon_inserts.sql", "w") as sql_file:
        for row in data:
            # Convert empty strings to NULL
            row = [f"NULL" if cell == '' else f"'{cell}'" for cell in row]
            values_str = ", ".join(row)
            sql_statement = f"INSERT INTO pokemon VALUES ({values_str});\n"
            sql_file.write(sql_statement)

if __name__ == "__main__":
    # Read the CSV file into a pandas DataFrame
    csv_file = "pokemon_data.csv"
    df = pd.read_csv(csv_file)

    # Convert the "name" column to strings
    df["name"] = df["name"].astype(str)

    # Replace any empty strings with None (NULL)
    df = df.where(df.ne('').all(axis=1), None)

    # Convert the DataFrame to a list of tuples for easier insertion
    data = [tuple(row) for row in df.values]

    # Generate the .sql file with INSERT statements
    create_sql_file(data)

    print("SQL file with INSERT statements created successfully!")
