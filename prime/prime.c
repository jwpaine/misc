/* John Paine
	12/12/2016
	Sieve of Eratosthenes
 */

#include <stdio.h>
#include <stdlib.h> // malloc

int main(int argc, char *argv[]) {

	if (argc < 2) {
		puts("Please specify prime number as command-line argument");
		return 0;
	}

	int *ints = NULL; /* record number of elements in integer array */
	int M = 1; /* max index of integers */
	int i = 1; /* index into integers */
	int primeCount = 0;

	ints = realloc(ints, (M + 2)*sizeof(int));
	ints[0] = 2;
	/* while our primeCount is less than the specified prime we desire */
	while(primeCount < atoi(argv[1])) {
		/* get next prime */
		/* we use an OR statement here so that we can drop into the while loop when i = 0 and realloc our array */
		while(ints[i] == 0 || i == M) {
			if (i == M) {
				/* resize */
				ints = realloc(ints, (M + 10)*sizeof(int));
				/* assign integers 2(k) + 1 (uneven integer) for k = M to M + 10, as the only even prime is 2 */
				for (int k = M; k < M + 10; k++) {
					ints[k] = 2*k + 1;
				}
				M += 10; /* increment max index by 10 */
				i = 1;
				primeCount = 0;
			}
			if (ints[i] == 0) {
				i++;
			}
		}
		primeCount++;
		/* zero out multiples */
		for (int j = i + ints[i]; j < M; j += ints[i] ) {
			ints[j] = 0;
		}
		/* move to next integer */
		i++;
	}

	printf("%dth Prime: %d\n", atoi(argv[1]), ints[i-2]);

	return 0;
}