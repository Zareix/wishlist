import { type Category } from '@prisma/client';
import { CheckCircle, Plus } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Input, InputError, InputGroup } from '@/components/ui/Inputs';
import { Label } from '@/components/ui/Label';
import { api } from '@/utils/api';

const AddCategory = ({
  categories,
  refetchCategories,
}: {
  categories: Category[];
  refetchCategories: () => void;
}) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<Pick<Category, 'name'>>();
  const addCategoryMutation = api.categories.create.useMutation();

  const onSubmit: SubmitHandler<Pick<Category, 'name'>> = (data) => {
    if (
      categories.find(
        (category) =>
          category.name.toLocaleLowerCase() === data.name.toLocaleLowerCase(),
      )
    ) {
      setError('name', {
        type: 'manual',
        message: 'This category already exists',
      });
    }
    addCategoryMutation
      .mutateAsync(data.name)
      .then(() => {
        refetchCategories();
      })
      .catch(console.error);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new category</DialogTitle>
          <DialogDescription>
            {addCategoryMutation.isSuccess ? (
              <>
                <div className="mx-auto flex items-center justify-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Category added
                </div>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => {
                      addCategoryMutation.reset();
                      reset();
                    }}
                    variant="outline"
                    className="mt-2"
                  >
                    Close
                  </Button>
                </DialogTrigger>
              </>
            ) : (
              <div className="mt-2 flex flex-col items-start gap-4">
                <InputGroup className="justify-items-start">
                  <Label>Name</Label>
                  <Input
                    placeholder="Name"
                    {...register('name', {
                      required: 'This field is required',
                      pattern: {
                        value: /^[a-zA-Z0-9 ]+$/,
                        message: 'Only alphanumeric characters',
                      },
                    })}
                  />
                  {errors.name && (
                    <InputError>{errors.name.message}</InputError>
                  )}
                </InputGroup>
                <Button
                  type="button"
                  className="ml-auto"
                  disabled={addCategoryMutation.isLoading}
                  onClick={() => handleSubmit(onSubmit)()}
                >
                  Add category
                </Button>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategory;
